import React, { Component } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import moment from "moment";

class Devices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 10,
            enableCreate: false,
            devices: []
        }
    }

    componentDidMount() {
        this.fetchDevices()
    }

    fetchDevices = () => {
        let url = process.env.REACT_APP_BACKEND_URL + '/devices/project/' + this.props.project._id + '/devices';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        devices: response.data.devices
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    devices: []
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
        let errorBanner = null;
        if (this.state.devices.length === 0) errorBanner = (<b>No Devices Currently Allocated for this project</b>)
        return (
            <div className="container" style={{ width: "85%", align: "center", marginTop: "20px" }}>
                <div className="row">
                    {this.state.devices.map((device, index) => {
                        return (
                            <div className="col-md-3" style={{ marginTop: "5px", marginBottom: "5px", paddingLeft: "0px" }}>
                                <Card className="cardBox" style={{ backgroundColor: "#b8babf" }}>
                                    <CardContent className="cardBoxColor" style={{ paddingBottom: "10px", paddingTop: "10px" }}>
                                        <div>
                                            <PhoneAndroidIcon style={{ fontSize: 85, color: "#081d40" }} />
                                        </div>
                                        <div style={{ fontSize: "14px", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                            <h4>{device.name}</h4>
                                            <div class="row" style={{ paddingLeft: "0px" }}>
                                                <Typography color="" variant="h6" style={{ display: "inline" }}>
                                                    {device.osType}
                                                </Typography>
                                            </div>
                                            <div class="row" style={{ paddingLeft: "0px" }}>
                                                <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-time"></span>
                                                    {moment(device.start_time).format("LLLL")}
                                                </Typography>
                                            </div>
                                            <div class="row" style={{ paddingLeft: "0px" }}>
                                                <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-time"></span>
                                                    {moment(device.end_time).format("LLLL")}
                                                </Typography>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    })}
                </div>
                <TablePagination
                    rowsPerPageOptions={[10, 20]}
                    component="div"
                    count={this.state.devices}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
                {errorBanner}
            </div>
        )
    }
}

export default Devices;