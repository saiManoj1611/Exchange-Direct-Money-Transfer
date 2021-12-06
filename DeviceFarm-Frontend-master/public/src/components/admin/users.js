import React, { Component } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 12,
            users: [],
            usersFilter: []
        }
        this.updateProjectStatus = this.updateProjectStatus.bind(this);
    }

    componentDidMount() {
        this.updateProjects();
    }

    updateProjects = () => {
        let url = process.env.REACT_APP_BACKEND_URL + '/admin/users';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        users: response.data,
                        usersFilter: response.data
                    })
                } else {
                    this.setState({
                        users: [],
                        usersFilter: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    users: [],
                    usersFilter: []
                })
            });
    }

    updateProjectStatus = (status, id) => {
        let url = process.env.REACT_APP_BACKEND_URL + '/admin/users/' + id;
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
        this.state.usersFilter.map(user => {
            if (user.name.toLowerCase().includes(event.target.value.toLowerCase())) {
                filter.push(user)
            }
        })
        this.setState({
            users: filter
        })
    }
    render() {
        return (
            <div className="container" style={{ width: "70%", marginTop: "10px" }}>
                <div class="input-group input-group-lg row" style={{ marginBottom: "15px", boxShadow: "0 2px 2px rgba(0,0,0,0.3)" }}>
                    <span class="input-group-addon" id="sizing-addon1">
                        <span class="glyphicon glyphicon-search"></span>
                    </span>
                    <input type="text" onChange={this.searchData} class="form-control" placeholder="Search Users by Name" aria-describedby="sizing-addon1" />
                </div>
                <div className="row">
                    {this.state.users.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((user, index) => {
                        return (
                            <div className="col-md-4" style={{ padding: "0px" }}>
                                <Card style={{ padding: "10px", margin: "5px" }}>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <Avatar variant="square" style={{ width: "80px", height: "80px", margin: "10px", backgroundColor: "#c6cdcf" }} >
                                                <h6><FaceIcon style={{ fontSize: 75, color: "#000" }} /></h6>
                                            </Avatar>
                                        </div>
                                        <div className="col-md-8" style={{ paddingLeft: "55px", textAlign: "left" }}>
                                            <div className="row inline"><h4 style={{ marginBottom: "6px", paddingBottom: "0px" }}>
                                                <Link to={"/tester/" + user._id + "/profile"} >{user.name}</Link>
                                            </h4></div>
                                            <div class="row">
                                                <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-envelope"></span>
                                                &nbsp;Email: {user.email}
                                                </Typography>
                                            </div>
                                            <div>
                                                {user.blocked ? (
                                                    <Button variant="outlined" color="primary" style={{ margin: "10px" }} onClick={() => this.updateProjectStatus(false, user._id)}>
                                                        Un-Block User
                                                    </Button>
                                                ) : (
                                                        <Button variant="outlined" color="secondary" style={{ margin: "10px" }} onClick={() => this.updateProjectStatus(true, user._id)}>
                                                            Block User
                                                        </Button>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )
                    })
                    }
                </div>
                <TablePagination
                    rowsPerPageOptions={[12, 20, 24]}
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

export default Users;