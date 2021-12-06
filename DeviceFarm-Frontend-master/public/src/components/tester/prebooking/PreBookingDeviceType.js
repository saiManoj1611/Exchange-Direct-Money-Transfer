import React, { Component } from 'react';
import axios from 'axios';
import TablePagination from '@material-ui/core/TablePagination';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Redirect, useParams } from 'react-router';
import Card from '@material-ui/core/Card';
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';

function PreBookingDeviceType(props) {
    let {projectId} = useParams();
    const colors = ["#3c4f36", "#626e7b", "#254284", "teal", "#003300"];
    return (
        <div className="container" style={{ width: "80%", align: "center", marginTop: "20px" }}>
        <div className='row'>
            <Link to={`/project/${projectId}/dashboard`} style={{ textDecoration: "none" }}>
                <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "rgb(225, 225, 225)" }} >
                    <ArrowBackIcon fontSize="large" /><b style={{ fontSize: "10px" }}> Back to Project</b>
                </Fab>
            </Link>
        </div>
        <div className="row">
            <Link to={{ pathname: `/tester/${sessionStorage.getItem("id")}/project/${projectId}/prebooking_allocations/real`}} style={{ textDecoration: "none" }}>
                <div title={"Go to on Real Devices"} className="col-md-3" style={{ width: "260px", marginRight: "5px", marginTop: "5px", marginBottom: "15px", paddingLeft: "0px" }}>
                    <Card className="cardBox">
                        <CardHeader style={{ backgroundColor: colors[0] }}
                            avatar={
                                <div style={{ height: "100px" }}></div>
                            }
                            action={
                                <IconButton aria-label="settings">
                                </IconButton>
                            }
                        />
                        <CardContent className="cardBoxColor" style={{ paddingBottom: "0px", paddingTop: "10px" }}>
                            <div style={{ fontSize: "16px", color: "#3c4f36", fontWeight: "600", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                {"Real Devices"}
                            </div>
                            {/* <div style={{ fontSize: "14px", color: "#6c757c", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                No of devices: {"2"}
                            </div> */}
                        </CardContent>
                        <CardActions disableSpacing style={{ paddingTop: "10px" }}>
                        </CardActions>
                    </Card>
                </div>
            </Link>
            <Link to={{ pathname: `/tester/${sessionStorage.getItem("id")}/project/${projectId}/prebooking_allocations/emulator`}} style={{ textDecoration: "none" }}>
                <div title={"Go to emulators "} className="col-md-3" style={{ width: "260px", marginRight: "5px", marginTop: "5px", marginBottom: "15px", paddingLeft: "0px" }}>
                    <Card className="cardBox">
                        <CardHeader style={{ backgroundColor: colors[1] }}
                            avatar={
                                <div style={{ height: "100px" }}></div>
                            }
                            action={
                                <IconButton aria-label="settings">
                                </IconButton>
                            }
                        />
                        <CardContent className="cardBoxColor" style={{ paddingBottom: "0px", paddingTop: "10px" }}>
                            <div style={{ fontSize: "16px", color: "#3c4f36", fontWeight: "600", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                {"Emulators"}
                            </div>
                            {/* <div style={{ fontSize: "14px", color: "#6c757c", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                No of devices: {"2"}
                            </div> */}
                        </CardContent>
                        <CardActions disableSpacing style={{ paddingTop: "10px" }}>
                        </CardActions>
                    </Card>
                </div>
            </Link>
        </div>
    </div>
);
}

export default PreBookingDeviceType;