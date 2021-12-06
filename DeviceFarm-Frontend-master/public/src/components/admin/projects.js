import React, { Component } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import BugReportIcon from '@material-ui/icons/BugReport';
import axios from 'axios';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 10,
            projects: [],
            projectFilter: []
        }
        this.updateProjectStatus = this.updateProjectStatus.bind(this);
    }

    componentDidMount() {
        this.updateProjects();
    }

    updateProjects = () => {
        let url = process.env.REACT_APP_BACKEND_URL + '/admin/projects';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        projects: response.data,
                        projectFilter: response.data
                    })
                } else {
                    this.setState({
                        projects: [],
                        projectFilter: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    projects: [],
                    projectFilter: []
                })
            });
    }

    updateProjectStatus = (status, id) => {
        let url = process.env.REACT_APP_BACKEND_URL + '/admin/projects/' + id;
        axios.defaults.withCredentials = true;
        axios.put(url, { "blocked": status })
            .then(response => {
                if (response.status === 200) {
                    this.updateProjects();
                }
            })
            .catch((error) => {
                this.updateProjects();
            });
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

    searchData = (event) => {
        let filter = [];
        this.state.projectFilter.map(project => {
            if (project.name.toLowerCase().includes(event.target.value.toLowerCase())) {
                filter.push(project)
            }
        })
        this.setState({
            projects: filter
        })
    }
    render() {
        return (
            <div className="container" style={{ width: "70%", marginTop: "20px" }}>
                <div class="input-group input-group-lg" style={{ marginBottom: "15px", boxShadow: "0 2px 2px rgba(0,0,0,0.3)" }}>
                    <span class="input-group-addon" id="sizing-addon1">
                        <span class="glyphicon glyphicon-search"></span>
                    </span>
                    <input type="text" onChange={this.searchData} class="form-control" placeholder="Search Projects by Name" aria-describedby="sizing-addon1" />
                </div>
                <div>
                    {this.state.projects.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((project, index) => {
                        return (
                            <Card style={{ padding: "10px", marginBottom: "4px" }}>
                                <div className="row">
                                    <div className="col-md-1">
                                        <Avatar variant="square" style={{ width: "80px", height: "80px", margin: "10px", backgroundColor: "#4c9fb0" }} >
                                            <h6><AccountTreeIcon style={{ fontSize: 75, color: "#000" }} /></h6>
                                        </Avatar>
                                    </div>
                                    <div className="col-md-9" style={{ paddingLeft: "55px", textAlign: "left" }}>
                                        <div className="row inline"><h4 style={{ marginBottom: "6px", paddingBottom: "0px" }}>{project.name}</h4></div>
                                        <div class="row">
                                            <Typography color="" variant="h6" style={{ display: "inline" }}>
                                                {project.description}
                                            </Typography>
                                        </div>
                                        <div class="row">
                                            <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-user"></span>
                                                &nbsp;Manager: {project.managerId.name}
                                            </Typography>
                                        </div>
                                        <div class="row" style={{ paddingLeft: "0px" }}>
                                            <Typography color="" variant="h6" style={{ display: "inline" }}>
                                                No of Testers: {project.testers.length}
                                            </Typography>
                                        </div>
                                        <div class="row" style={{ paddingLeft: "0px" }}>
                                            <Link to={{ pathname: '/admin/project/' + project._id + '/dashboard', project: project }}
                                                style={{ textDecoration: "underline", fontWeight: "500" }}>
                                                View Project Details
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        {project.blocked ? (
                                            <Button variant="outlined" color="primary" onClick={() => this.updateProjectStatus(false, project._id)}>
                                                Un-Block Project
                                            </Button>
                                        ) : (
                                                <Button variant="outlined" color="secondary" onClick={() => this.updateProjectStatus(true, project._id)}>
                                                    Block Project
                                                </Button>
                                            )}
                                    </div>
                                </div>
                            </Card>
                        )
                    })
                    }
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={1}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </div>
        )
    }
}

export default Projects;