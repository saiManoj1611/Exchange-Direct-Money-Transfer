import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Fab from "@material-ui/core/Fab";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import AddTesters from "./addTesters";
import _ from 'lodash';

const columns = [
    { id: 'name', label: 'Name', minWidth: 130 },
    { id: 'email', label: 'Email Id', minWidth: 130 },
    { id: 'remove', label: '', minWidth: 50 }
];

class Testers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {},
            testers: [],
            page: 0,
            rowsPerPage: 5,
            enableAdd: false
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.toggleAddTesters = this.toggleAddTesters.bind(this);
        this.updateTesters = this.updateTesters.bind(this);
        this.deleteTester = this.deleteTester.bind(this);
    }

    componentDidMount() {
        this.props.getProjectInfo()
        this.setState({
            project: this.props.project,
            testers: _.isEmpty(this.props.project) ? [] : this.props.project.testers
        })
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

    toggleAddTesters = () => {
        console.log(this.state.enableAdd)
        this.setState({
            enableAdd: !this.state.enableAdd
        })
    }

    updateTesters = () => {
        let url = process.env.REACT_APP_BACKEND_URL + '/project/' + this.state.project._id + '/testers?list=true';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        testers: response.data
                    })
                } else {
                    this.setState({
                        testers: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    testers: []
                })
            });
    }

    deleteTester = (id) => {
        let url = process.env.REACT_APP_BACKEND_URL + '/project/' + this.state.project._id + '/testers?id=' + id;
        axios.defaults.withCredentials = true;
        axios.delete(url)
            .then(response => {
                if (response.status === 200) {
                    this.updateTesters()
                }
            })
            .catch((error) => {
            });
    }

    render() {
        let errorBanner = null;
        if (this.state.testers.length === 0) errorBanner = (<b>No Testers Currently</b>)
        let addDialog = null;
        if (this.state.enableAdd) addDialog = (<AddTesters toggleAddTesters={this.toggleAddTesters} projectId={this.state.project._id} enableAdd={this.state.enableAdd} updateTesters={this.updateTesters} />)
        else addDialog = null;
        let addTesterButton = null;
        if (sessionStorage.getItem("persona") === "manager") {
            addTesterButton = (
                <div className="col-md-12" style={{ marginBottom: "0px", textAlign: "right" }}>
                    <Button variant="outlined" color="primary" onClick={this.toggleAddTesters} style={{ marginLeft: "8px", marginBottom: "5px", padding: "7px", border: "1.5px solid #3f51b5" }}>
                        <b style={{ fontSize: "10px" }}>Add Testers to Project</b>
                    </Button>
                    <br />
                </div>
            )
        } else {
            addTesterButton = null;
        }
        return (
            <div className="container" style={{ width: "75%", alignItems: "center", marginTop: "20px" }}>
                {addDialog}
                <div className="row">
                    {/* <div className="col-md-9" style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                        <Link to="/manager/projects" style={{ textDecoration: "none" }}>
                            <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "rgb(225, 225, 225)" }} onClick={this.toggleCreate} >
                                <ArrowBackIcon fontSize="large" /><b style={{ fontSize: "10px" }}> Back to All Projects</b>
                            </Fab>
                        </Link>
                    </div> */}
                    {addTesterButton}
                    
                </div>
                {/* <Card style={{ borderRadius: ".5px", marginBottom: "0px", padding: "12px", backgroundColor: "white", textAlign: "center" }}>
                    <div className="row">
                        <h3 style={{ display: "inline", marginRight: "10px" }}>{this.state.project.name}</h3>
                    </div>
                </Card> */}
                <Paper style={{ width: "100%", align: "center" }}>
                    <TableContainer style={{ maxHeight: "80%" }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, backgroundColor: "#ababab", fontWeight: "bold", textAlign: "center", fontSize: "13px" }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.testers.map((row, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row['id']['_id']}>
                                            {columns.map(column => {
                                                console.log(row['id']['_id'])
                                                let value = row['id'][column.id];
                                                if (column.id === "remove" && sessionStorage.getItem("persona") === "manager") {
                                                    return (
                                                        <TableCell style={{ fontSize: "10px", textAlign: "center" }} onClick={() => this.deleteTester(row['id']["_id"])} id={row["_id"]}>
                                                            <Button color="secondary">Remove from Project</Button>
                                                        </TableCell>
                                                    )
                                                }
                                                return (
                                                    <TableCell key={column.id} align={column.align} style={{ fontSize: "12px", textAlign: "center" }}>
                                                        <Link to={"/tester/" + row['id']['_id'] + "/profile"} >{value}</Link>
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={this.state.testers.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
                <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
            </div>
        )
    }
}

export default Testers;