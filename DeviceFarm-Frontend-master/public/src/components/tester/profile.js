import React, { Component } from 'react';
import axios from 'axios';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography'
import PhoneIcon from '@material-ui/icons/Phone';
import HomeIcon from '@material-ui/icons/Home';
import ComputerIcon from '@material-ui/icons/Computer';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            location: "",
            contact_num: "",
            address: "",
            skills: "",
            enableContactSave: false
        }
        this.contactSaveHandler = this.contactSaveHandler.bind(this)
        this.fetchCompanyDetails = this.fetchCompanyDetails.bind(this)
    }

    componentDidMount() {
        this.fetchCompanyDetails();
    }

    fetchCompanyDetails = () => {
        const { match: { params } } = this.props;
        let id = params.id;
        let url = process.env.REACT_APP_BACKEND_URL + '/profile/' + id;
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    this.setState({
                        name: response.data.name,
                        email: response.data.email,
                        location: response.data.location,
                        contact_num: response.data.contact_num,
                        address: response.data.address,
                        skills: response.data.skills
                    })
                }
            })
            .catch((error) => {
            });
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    contactSaveHandler = (event) => {
        let url = process.env.REACT_APP_BACKEND_URL + '/profile/' + sessionStorage.getItem("id");
        axios.defaults.withCredentials = true;
        axios.put(url, {
            location: this.state.location,
            contact_num: this.state.contact_num,
            skills: this.state.skills,
            address: this.state.address
        })
            .then(response => {
                if (response.status === 200) {
                    this.fetchCompanyDetails();
                    this.setState({
                        enableContactSave: false
                    })
                } else {
                    this.setState({
                        enableContactSave: true
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    enableContactSave: true
                })
            });
    }
    enableContactEdit = (event) => {
        this.setState({
            enableContactSave: !this.state.enableContactSave
        })
    }

    render() {
        let descriptionSave = null;
        if (this.state.enableDescriptionSave) {
            descriptionSave = (
                <button type="button" style={{ backgroundColor: "#0d7f02" }} class="btn btn-success" onClick={this.descriptionSaveHandler}>Save</button>
            )
        } else descriptionSave = null

        let contactSave = null;
        if (this.state.enableContactSave) {
            contactSave = (
                <div>
                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                        <label for="contactNumber">Contact Number</label>
                        <input onChange={this.onChange} value={this.state.contact_num} name="contact_num" type="mobile" class="form-control" placeholder="Enter Contact Number"></input>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                        <label for="contactNumber">Location</label>
                        <input onChange={this.onChange} value={this.state.location} name="location" type="text" class="form-control" placeholder="Location"></input>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                        <label for="contactNumber">Skills</label>
                        <input onChange={this.onChange} value={this.state.skills} name="skills" type="text" class="form-control" placeholder="Skills"></input>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: "10px" }}>
                        <label for="contactNumber">Address</label>
                        <input onChange={this.onChange} value={this.state.address} name="address" type="text" class="form-control" placeholder="Address"></input>
                    </div>
                    <div class="col-md-12" style={{ textAlign: "-webkit-right", paddingRight: "15px" }}>
                        <button type="button" onClick={this.enableContactEdit} style={{ backgroundColor: "rgba(0,0,0,.06)", color: "black", marginRight: "5px" }} class="btn btn-secondary" >Cancel</button>
                        <button type="button" style={{ backgroundColor: "#0d7f02" }} class="btn btn-success" onClick={this.contactSaveHandler}>Save</button>
                    </div>
                </div>
            )
        } else {
            contactSave = (
                <div>
                    <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><PhoneIcon style={{ fontSize: 25 }} color="primary" /></div>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                            &nbsp;&nbsp;{this.state.contact_num === "" ? "NA" : this.state.contact_num}
                        </Typography>
                        </div>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><LocationOnIcon style={{ fontSize: 25 }} color="primary" /></div>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                            &nbsp;&nbsp;{this.state.location === "" ? "NA" : this.state.location}
                        </Typography>
                        </div>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><ComputerIcon style={{ fontSize: 25 }} color="primary" /></div>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                            &nbsp;&nbsp;{this.state.skills === "" ? "NA" : this.state.skills}
                        </Typography>
                        </div>
                    </div>
                    <div class="col-md-12" style={{ marginBottom: "10px", display: "inline", verticalAlign: "middle" }}>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><HomeIcon style={{ fontSize: 25 }} color="primary" /></div>
                        <div style={{ display: "inline", verticalAlign: "middle" }}><Typography gutterBottom variant="subtitle">
                            &nbsp;&nbsp;{this.state.address === "" ? "NA" : this.state.address}
                        </Typography>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div style={{ marginTop: "30px" }}>
                <div className="container" style={{ width: "75%", height: "100%" }}>
                    <div class="row" style={{ width: "100%" }}>
                        <div class="col-md-4">
                            <Card>
                                <CardContent style={{ textAlign: "-webkit-right" }} >
                                    <div style={{ textAlign: "-webkit-center" }}>
                                        <Avatar className="changePhoto" variant="circle" style={{ cursor: "pointer", width: "130px", height: "130px", margin: "15px", backgroundColor: "brown" }}>
                                            <h1 style={{ fontSize: "70px" }}>{this.state.name.substr(0, 1)}</h1>
                                        </Avatar>
                                    </div>
                                    <div style={{ textAlign: "-webkit-center" }}>
                                        <h3>{this.state.name}</h3>
                                    </div>
                                    <div style={{ textAlign: "-webkit-center" }}>
                                    </div>
                                    <div style={{ textAlign: "-webkit-center", marginTop: "10px" }}>
                                        <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span><h5 style={{ display: "inline", paddingBottom: "90px" }}> {this.state.email}</h5>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div class="col-md-8">
                            <Card style={{ marginBottom: "0px", paddingBottom: "10px", paddingTop: "15px" }}>
                                <div class="row">
                                    <div class="col-md-10">
                                        <h4 style={{ marginBottom: "15px", paddingBottom: "0px", marginLeft: "15px" }}>Personal Info</h4>
                                    </div>
                                    <div class="col-md-2" style={{ textAlign: "-webkit-center" }}>
                                        {
                                            sessionStorage.getItem("persona") === "tester" ? (
                                                <EditIcon className="editicon" color="primary" onClick={this.enableContactEdit} style={{ textAlign: "-webkit-right", cursor: "pointer" }} />
                                            ) : ""
                                        }
                                    </div>
                                </div>
                                <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                                    {contactSave}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div >
            </div>
        )
    }
}

export default Profile;