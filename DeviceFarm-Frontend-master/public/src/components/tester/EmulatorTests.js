import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactJson from 'react-json-view'
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import Loading from '../loading';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const columns = [
    { id: 'runName', label: 'Name', minWidth: 170 },
    { id: 'testerId', label: 'Started By', minWidth: 100 },
    {
        id: 'started',
        label: 'Started At',
        minWidth: 170
    },
    {
        id: 'stopped',
        label: 'Ended At',
        minWidth: 100
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 100
    },
    {
        id: 'result',
        label: 'Result',
        minWidth: 170
    },
    { id: 'view', label: '', minWidth: 50 },
    { id: 'stop', label: '', minWidth: 50 }
];


class EmulatorTests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 10,
            remoteSessions: [],
            loading: false,
            loadingText: "",
            sessionDetails: {},
            detailsPage: false,
            currentTest: ""
        }
        this.fetchEmulatorSessions = this.fetchEmulatorSessions.bind(this);
        this.updateEmulatorSessions = this.updateEmulatorSessions.bind(this);
    }

    componentDidMount() {
        this.fetchEmulatorSessions();
    }

    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        })
    };

    handleChangeRowsPerPage = event => {
        this.setState({
            rowsPerPage: event.target.value,
            page: 0
        })
    };

    updateEmulatorSessions = () => {
        let url = process.env.REACT_APP_BACKEND_URL + '/remoteAccessSession/updateAll';
        let data = {
            ids: this.state.remoteSessions.map(session => session._id)
        }
        axios.defaults.withCredentials = true;
        this.setState({
            loading: true,
            loadingText: "Fetching sessions!"
        })
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        loading: false,
                        loadingText: "",
                        remoteSessions: response.data.remoteSessions
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    loadingText: "",
                    remoteSessions: []
                })
            });
    }

    fetchEmulatorSessions = () => {
        const { project } = this.props;
        let url = process.env.REACT_APP_BACKEND_URL + '/remoteAccessSession';
        let params = {
            project: project
        }
        this.props.tester && (params.tester = this.props.tester);
        axios.defaults.withCredentials = true;
        axios.get(url, {params: params})
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        remoteSessions: response.data.remoteSessions
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    remoteSessions: []
                })
            });
    }

    openDetails = (sessionDetails) => {
        this.setState({
            detailsPage: true,
            sessionDetails: sessionDetails
        })
    }

    closeDetails = () => {
        this.setState({
            detailsPage: false,
            sessionDetails: {}
        })
    }

    render() {
        return (
            <div class="container" style={{ width: "95%", marginTop: "20px" }} >
                <Dialog style={{ overflowX: "hidden !important" }} fullWidth open={this.state.detailsPage} onClose={this.closeDetails} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Run Details</DialogTitle>
                    <DialogContent>
                        <ReactJson 
                        src={this.state.sessionDetails} 
                        collapsed={false}
                        displayDataTypes={false}
                        sortKeys={false}
                        enableClipboard={false}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDetails} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <div className="row">
                    <Loading loading={this.state.loading} loadingText={this.state.loadingText} />
                    <div className='col-md-6' style={{'text-align':'left', 'padding-left':'30px', 'padding-bottom': '10px'}}>
                    <Typography variant="h3"><b>Remote Session Details</b></Typography>
                    </div>
                    <div className='col-md-6' style={{'text-align':'right'}}>
                        <button type="button" class="btn btn-success" onClick={this.updateEmulatorSessions}>
                            <span class="glyphicon glyphicon-refresh"></span>  Refresh Status
                        </button>
                    </div>
                </div>
                <Loading loading={this.state.loading} loadingText={this.state.loadingText} />
                <div>
                    <Paper >
                        <TableContainer style={{}} >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{minWidth: 100, backgroundColor: "#ababab", fontSize: "12px", textAlign: "center" }}>
                                            Device Name
                                        </TableCell>
                                        <TableCell style={{minWidth: 100, backgroundColor: "#ababab", fontSize: "12px", textAlign: "center" }}>
                                            Allocation Type
                                        </TableCell>
                                        <TableCell style={{minWidth: 100, backgroundColor: "#ababab", fontSize: "12px", textAlign: "center" }}>
                                            Started At
                                        </TableCell>
                                        <TableCell style={{minWidth: 100, backgroundColor: "#ababab", fontSize: "12px", textAlign: "center" }}>
                                            Device Minites
                                        </TableCell>
                                        <TableCell style={{minWidth: 100, backgroundColor: "#ababab", fontSize: "12px", textAlign: "center" }}>
                                            Status
                                        </TableCell>
                                        <TableCell style={{minWidth: 100, backgroundColor: "#ababab", fontSize: "12px", textAlign: "center" }}>
                                            Result
                                        </TableCell>
                                        <TableCell style={{minWidth: 100, backgroundColor: "#ababab", fontSize: "12px", textAlign: "center" }}>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.remoteSessions.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                <TableCell style={{minWidth: 100, fontSize: "12px", textAlign: "center" }}>
                                                    {row.sessionDetails.status !== 'RUNNING' ? (row.sessionDetails.device.name)
                                                    :
                                                    (<Link to={`/project/${row.project}/remoteAccessSession/${row._id}`}>{row.sessionDetails.device.name}</Link>)
                                                    }
                                                </TableCell>
                                                <TableCell style={{minWidth: 100, fontSize: "12px", textAlign: "center" }}>
                                                    {row.allocationType}
                                                </TableCell>
                                                <TableCell style={{minWidth: 100, fontSize: "12px", textAlign: "center" }}>
                                                    {moment(row.sessionDetails.created).format("LLLL")}
                                                </TableCell>
                                                <TableCell style={{minWidth: 100, fontSize: "12px", textAlign: "center" }}>
                                                {row.sessionDetails.deviceMinutes.total}
                                                </TableCell>
                                                <TableCell style={{minWidth: 100, fontSize: "12px", textAlign: "center" }}>
                                                    {row.sessionDetails.status}
                                                </TableCell>
                                                <TableCell style={{minWidth: 100, fontSize: "12px", textAlign: "center" }}>
                                                    {row.sessionDetails.result}
                                                </TableCell>
                                                <TableCell style={{ textAlign: "center", fontSize: "12px" }}>
                                                    <Button color="primary" onClick={() => this.openDetails(row.sessionDetails)}>View Details</Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Paper>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={this.state.remoteSessions.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </div>
            </div>
        )
    }
}

export default EmulatorTests;