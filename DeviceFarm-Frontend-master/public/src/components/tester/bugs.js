import React, { Component } from 'react';
import axios from 'axios';
import TablePagination from '@material-ui/core/TablePagination';
import Card from '@material-ui/core/Card';
import CreateBug from './createBug';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import BugReportIcon from '@material-ui/icons/BugReport';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Link } from 'react-router-dom';

class Bugs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bugs: [],
            page: 0,
            rowsPerPage: 10,
            enableCreate: false
        }
        this.updateProjects = this.updateProjects.bind(this);
        this.toggleCreate = this.toggleCreate.bind(this);
    }

    componentDidMount() {
        this.updateProjects();
    }

    updateProjects = () => {
        const { project } = this.props;
        let url = process.env.REACT_APP_BACKEND_URL + '/project/' + project._id + '/bugs';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        bugs: response.data
                    })
                } else {
                    this.setState({
                        bugs: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    bugs: []
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

    render() {
        const {  project } = this.props;
        let errorBanner = null;
        if (this.state.bugs.length === 0) errorBanner = (<b>No Bugs Found for this project</b>)
        let createDialog = null;
        if (this.state.enableCreate) createDialog = (<CreateBug id={project._id} toggleCreate={this.toggleCreate} enableCreate={this.state.enableCreate} updateProjects={this.updateProjects} />)
        else createDialog = null;
        return (
            <div className="container" style={{ width: "80%", align: "center", marginTop: "10px" }}>
                {createDialog}
                <div className="row" style={{textAlign:"left", marginBottom:"10px"}}>
                    <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "white" }} onClick={this.toggleCreate} >
                        <AddIcon /><b style={{ fontSize: "10px" }}>Create New Bug</b>
                    </Fab>
                    <br />
                </div>
                <div className="row">
                    {this.state.bugs.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((bug, index) => {
                        return (
                            <Card style={{ padding: "5px", marginBottom: "4px" }}>
                                <div className="row">
                                    <div className="col-md-1">
                                        <Avatar variant="square" style={{ width: "100px", height: "100px", margin: "10px", backgroundColor: "#ff4f4f" }} >
                                            <h6><BugReportIcon style={{ fontSize: 85, color: "#000" }} /></h6>
                                        </Avatar>
                                    </div>
                                    <div className="col-md-9" style={{ paddingLeft: "75px", textAlign: "left" }}>
                                        <div className="row inline"><h4 style={{ marginBottom: "6px", paddingBottom: "0px" }}>{bug.name}</h4></div>
                                        <div class="row">
                                            <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-user"></span>
                                                Logged by: {bug.testerId.name}
                                            </Typography>
                                        </div>
                                        <div class="row" style={{ paddingLeft: "0px" }}>
                                            <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-time"></span>
                                                Logged at: {bug.loggedOn}
                                            </Typography>
                                        </div>
                                        <div class="row">
                                            <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-hourglass"></span>
                                                Priority: {bug.priority}
                                            </Typography>
                                        </div>
                                        <div class="row">
                                            <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-info-sign"></span>
                                                {bug.description}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
                <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
                <TablePagination
                    rowsPerPageOptions={[10, 20]}
                    component="div"
                    count={this.state.bugs.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </div>
        )
    }
}

export default Bugs;