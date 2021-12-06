import React, { Component } from 'react';
import axios from 'axios';
import TablePagination from '@material-ui/core/TablePagination';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CreateProject from "./createProject";
import Card from '@material-ui/core/Card';
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { Link } from 'react-router-dom';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            page: 0,
            rowsPerPage: 10,
            enableCreate: false,
            jobId: "",
            projectFilter: []
        }
        this.viewApplicants = this.viewApplicants.bind(this);
        this.toggleCreate = this.toggleCreate.bind(this);
        this.updateProjects = this.updateProjects.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
    }

    componentDidMount() {
        this.updateProjects();
    }

    updateProjects = () => {
        let url = process.env.REACT_APP_BACKEND_URL + '/projects/' + sessionStorage.getItem("id") + '?persona=manager';
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
                        projectFilter:[]
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    projects: [],
                    projectFilter:[]
                })
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

    toggleCreate = () => {
        this.setState({
            enableCreate: !this.state.enableCreate
        })
    }

    viewApplicants = id => {
        this.setState({
            jobId: id
        })

    }

    deleteProject = id => {
        let url = process.env.REACT_APP_BACKEND_URL + '/projects/' + id;
        axios.delete(url)
            .then(response => {
                if (response.status === 200) {
                    this.updateProjects();
                }
            })
            .catch((error) => {
                this.updateProjects();
            });
    }

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
        const colors = ["#3c4f36", "#626e7b", "#254284", "teal", "#003300"]
        let createDialog = null;
        if (this.state.enableCreate) createDialog = (<CreateProject toggleCreate={this.toggleCreate} enableCreate={this.state.enableCreate} updateProjects={this.updateProjects} />)
        else createDialog = null;
        let errorBanner = null;
        if (this.state.projects.length === 0) errorBanner = (<b>No Projects Found</b>)
        return (
            <div className="container" style={{ width: "80%", align: "center", marginTop: "10px" }}>
                {createDialog}
                <div className="row">
                    <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "white" }} onClick={this.toggleCreate} >
                        <AddIcon /><b style={{ fontSize: "10px" }}>Create New Project</b>
                    </Fab>
                    <br />
                </div>
                {/* <div class="input-group input-group-lg" style={{ marginBottom: "15px", boxShadow: "0 2px 2px rgba(0,0,0,0.3)" }}>
                    <span class="input-group-addon" id="sizing-addon1">
                        <span class="glyphicon glyphicon-search"></span>
                    </span>
                    <input type="text" onChange={this.searchData} class="form-control" placeholder="Search Projects by Name" aria-describedby="sizing-addon1" />
                </div> */}
                <div className="row" style={{marginTop:"10px"}}>
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
                                        <Link to={{ pathname: '/manager/project/' + project._id + '/dashboard', project: project }} >
                                            <div className="row inline"><h4 style={{ marginBottom: "6px", paddingBottom: "0px" }}>{project.name}</h4></div>
                                        </Link>
                                        <div class="row">
                                            <Typography color="" variant="h6" style={{ display: "inline" }}>
                                                {project.description}
                                            </Typography>
                                        </div>
                                        <div class="row" style={{ paddingLeft: "0px" }}>
                                            <Typography color="" variant="h6" style={{ display: "inline" }}>
                                                No of Testers: {project.testers.length}
                                            </Typography>
                                        </div>
                                        <div class="row" style={{ paddingLeft: "0px" }}>
                                            <Link to={{ pathname: '/manager/project/' + project._id + '/dashboard', project: project }}
                                                style={{ textDecoration: "underline", fontWeight: "500" }}>
                                                View Project Details
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <Button variant="outlined" color="secondary" onClick={() => this.deleteProject(project._id)}>
                                            <span title="Delete" class="glyphicon glyphicon-trash" style={{ fontSize: "16px", color: "red", marginRight: "5px" }}></span><b>Delete Project</b>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
                <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
                <TablePagination
                    rowsPerPageOptions={[10, 20]}
                    component="div"
                    count={this.state.projects.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </div >
        )
    }
}

export default Projects;