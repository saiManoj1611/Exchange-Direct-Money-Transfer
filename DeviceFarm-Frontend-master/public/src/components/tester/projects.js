import React, { Component } from 'react';
import axios from 'axios';
import TablePagination from '@material-ui/core/TablePagination';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Redirect } from 'react-router';
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
            jobId: ""
        }
        this.viewApplicants = this.viewApplicants.bind(this);
        this.updateProjects = this.updateProjects.bind(this);
    }

    componentDidMount() {
        this.updateProjects();
    }
    updateProjects = () => {
        let url = process.env.REACT_APP_BACKEND_URL + '/projects/' + sessionStorage.getItem("id") + '?persona=tester';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        projects: response.data
                    })
                } else {
                    this.setState({
                        projects: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    projects: []
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

    viewApplicants = id => {
        this.setState({
            jobId: id
        })

    }
    render() {
        const colors = ["#3c4f36", "#626e7b", "#254284", "teal", "#003300"];
        let errorBanner = null;
        if (this.state.projects.length === 0) errorBanner = (<b>No Projects Found</b>)
        return (
            <div className="container" style={{ width: "80%", align: "center", marginTop: "20px" }}>
                <div className="row">
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
                                        <Link to={{ pathname: '/project/' + project._id + '/dashboard', project: project }} >
                                            <div className="row inline"><h4 style={{ marginBottom: "6px", paddingBottom: "0px" }}>{project.name}</h4></div>
                                        </Link>
                                        <div class="row">
                                            <Typography color="" variant="h6" style={{ display: "inline" }}>
                                                {project.description}
                                            </Typography>
                                        </div>
                                        <div class="row" style={{ fontSize: "14px", color: "#6c757c", }}>
                                            <b>Manager: {project.managerId.name}</b>
                                        </div>
                                        <div class="row" style={{ fontSize: "14px", color: "#6c757c", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                            No of Testers in Project: {project.testers.length}
                                        </div>
                                        <div class="row" style={{ paddingLeft: "0px" }}>
                                            <Link to={{ pathname: '/project/' + project._id + '/dashboard', project: project }}
                                                style={{ textDecoration: "underline", fontWeight: "500" }}>
                                                View Project Details
                                            </Link>
                                        </div>
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
            </div>
        )
    }
}

export default Projects;