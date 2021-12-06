import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const minCost = 0.5;

class Bills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedProject: 'all',
            projects: [],
            selectedProjectTotalCost: 0,
            data: []
        }

        this.getProjects = this.getProjects.bind(this);
    }

    componentDidMount() {
        this.getProjects();
    }

    getProjects = () => {
        let url = process.env.REACT_APP_BACKEND_URL + '/admin/projects';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    let projectNames = []
                    response.data.forEach(element => {
                        projectNames.push({ "name": element.name, "id": element._id })
                    });
                    this.setState({
                        projects: projectNames
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    projects: []
                })
            });
    }

    onChangeProject = (event) => {
        if (event.target.value != 'all') {
            this.setState({
                selectedProject: event.target.value
            })
            let project = null;
            this.state.projects.forEach(element => {
                if (element.name === event.target.value) {
                    project = element;
                }
            });
            this.getProjectAllocationInfo(project);
        }
        else {
            this.setState({
                selectedProject: 'all'
            })
        }

    }

    fetchEmulatorSessions = async (project) => {
        return await new Promise((resolve, reject) => {
            let url = process.env.REACT_APP_BACKEND_URL + '/remoteAccessSession';
            let params = {
                project: project.id
            }
            axios.defaults.withCredentials = true;
            axios.get(url, { params: params })
                .then(response => {
                    if (response.status === 200 && response.data) {
                        console.log('response.data.remoteSessions');
                        console.log(response.data);
                        resolve(response.data.remoteSessions);
                    } else {
                        reject(response.data.error);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        })
    }

    fetchRuns = async (project) => {
        return await new Promise((resolve, reject) => {
            let url = process.env.REACT_APP_BACKEND_URL + '/project/' + project.id + '/tests';
            axios.defaults.withCredentials = true;
            axios.get(url)
                .then(response => {
                    if (response.status === 200) {
                        resolve(response.data);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        })
    }


    getProjectAllocationInfo = async (project) => {
        let remoteSessions = await this.fetchEmulatorSessions(project).catch(e => {
            console.error(e);
            return [];
        });
        let runs = await this.fetchRuns(project).catch(e => {
            console.error(e);
            return [];
        });
        this.generateData(runs, remoteSessions);
    }

    generateData = (runs, remoteSessions) => {
        let data = [];

        remoteSessions.forEach(session => {
            let deviceMinutes = parseFloat((session.sessionDetails.deviceMinutes || { total: 0 }).total);
            let device = session.sessionDetails.device.name;
            let cost = 0;
            if (deviceMinutes > 0) {
                cost = (Math.round(deviceMinutes * 100) / 100) * minCost;
            }

            data.push({ device: device, deviceType: 'Emulator', deviceminutes: deviceMinutes, cost: cost });
        });
        runs.forEach(run => {
            let deviceMinutes = parseFloat((run.deviceMinutes || { total: 0 }).total)
            let device = run.selectedDevices[0].name;
            let cost = 0;
            if (deviceMinutes > 0) {
                cost = (Math.round(deviceMinutes * 100) / 100) * minCost;
            }

            data.push({ device: device, deviceType: 'Real', deviceminutes: deviceMinutes, cost: cost });
        });

        let output = [];
        data.forEach(function (item) {
            var existing = output.filter(function (v, i) {
                return v.device == item.device && v.deviceType == item.deviceType;
            });
            if (existing.length) {
                var existingIndex = output.indexOf(existing[0]);
                output[existingIndex].deviceminutes = output[existingIndex].deviceminutes + item.deviceminutes;
                output[existingIndex].cost = output[existingIndex].cost + item.cost;
            } else {
                output.push(item);
            }
        });

        let totalCost = 0;
        output.forEach(dataElement => {
            totalCost += dataElement.cost;
        });

        this.setState({
            data: output,
            selectedProjectTotalCost: totalCost
        })

        console.log(output);

    }

    render() {
        let totalCostElement = null;

        if (this.state.selectedProject === 'all') {
            totalCostElement = <h>Please select project to view total cost and details</h>
        }
        else {
            totalCostElement = <div>
                <div style={{ padding: "0px 0px 40px 0px", border: '1px solid gray', borderRadius: '5px' }}>
                    <h style={{ float: "left", padding: "10px" }}><b>Total Cost</b></h>
                    <h style={{ float: "right", padding: "10px" }}><b>${this.state.selectedProjectTotalCost}</b></h>
                </div>
                <br></br>
                <div>
                    <h style={{ float: "left" }}><b>Details</b></h>
                    <TableContainer component={Paper}>
                        <Table style={{minWidth: 700}} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell style={{fontSize:'1.5rem'}}>#</StyledTableCell>
                                    <StyledTableCell style={{fontSize:'1.5rem'}}>Device</StyledTableCell>
                                    <StyledTableCell style={{fontSize:'1.5rem'}}>Device Type</StyledTableCell>
                                    <StyledTableCell style={{fontSize:'1.5rem'}}>Device Minutes</StyledTableCell>
                                    <StyledTableCell style={{fontSize:'1.5rem'}}>Cost</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {this.state.data.map((dataElement, index) =>
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{dataElement.device}</StyledTableCell>
                                    <StyledTableCell>{dataElement.deviceType}</StyledTableCell>
                                    <StyledTableCell>{dataElement.deviceminutes}</StyledTableCell>
                                    <StyledTableCell>{dataElement.cost}</StyledTableCell>
                                </StyledTableRow>
                            )
                            }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        }
        return (
            <div style={{ marginTop: "40px", overflowX: "hidden", overflowY: "hidden" }}>
                <div className="container" style={{ width: "920px", backgroundColor: "white", borderRadius: "7px", padding: "30px 40px 60px", textAlign: "-webkit-center" }}>
                    <div style={{ padding: "0px 0px 20px 0px" }}>
                        <div className="dropdown">
                            <select ref="userInput"
                                required
                                style={{ width: "400px" }}
                                className="form-control"
                                value={this.state.selectedProject}
                                onChange={this.onChangeProject}>
                                <option key='all' value='all'>List of Projects</option>
                                {
                                    this.state.projects.map((project) => {
                                        return <option key={project.id} value={project.name}>{project.name}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div>
                        {totalCostElement}
                    </div>
                </div>
            </div>

        )
    }
};

export default Bills;