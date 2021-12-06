import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import moment from "moment";

class AllocateDevice extends Component {
    constructor(props) {
        super(props);
        this.enableCreate = this.props.enableCreate;
        this.state = {
            devices: [
                {
                    "arn": "arn:aws:devicefarm:us-west-2::device:E1F3149FDC33484D824BCFF66003E609",
                    "name": "Google Pixel 3 XL",
                    "manufacturer": "Google",
                    "model": "Google Pixel 3 XL",
                    "modelId": "Pixel 3 XL",
                    "formFactor": "PHONE",
                    "platform": "ANDROID",
                    "os": "9"
                },
                {
                    "arn": "arn:aws:devicefarm:us-west-2::device:58D6FB12B3624256AED26D0F940D4427",
                    "name": "Google Pixel 2",
                    "manufacturer": "Pixel 2",
                    "model": "Google Pixel 2",
                    "modelId": "Google Pixel 2",
                    "formFactor": "PHONE",
                    "platform": "ANDROID",
                    "os": "9"
                },
                {
                    "arn": "arn:aws:devicefarm:us-west-2::device:E4438F5D016544A8BB8557C459084F9D",
                    "name": "Samsung Galaxy A50",
                    "manufacturer": "Samsung",
                    "model": "Galaxy A50",
                    "modelId": "SM-A505U1",
                    "formFactor": "PHONE",
                    "platform": "ANDROID",
                    "os": "9"
                },
                {
                    "arn": "arn:aws:devicefarm:us-west-2::device:8F772FF1E1AE4433B82286B1DA52FED8",
                    "name": "Samsung Galaxy S9+ (Unlocked)",
                    "manufacturer": "Samsung",
                    "model": "Galaxy S9+ (Unlocked)",
                    "modelId": "SM-G965U1",
                    "formFactor": "PHONE",
                    "platform": "ANDROID",
                    "os": "9"
                },
                {
                    "arn": "arn:aws:devicefarm:us-west-2::device:F27533F73A894EBDACC0E1B694288B77",
                    "name": "Samsung Galaxy S9 (Unlocked)",
                    "manufacturer": "Samsung",
                    "model": "Galaxy S9 (Unlocked)",
                    "modelId": "SM-G960U1",
                    "formFactor": "PHONE",
                    "platform": "ANDROID",
                    "os": "8.0.0"
                },
                {
                    "arn": "arn:aws:devicefarm:us-west-2::device:9A1CD324234F452F806C3A758762B755",
                    "name": "Samsung Galaxy Note 9",
                    "manufacturer": "Samsung",
                    "model": "Samsung Galaxy Note 9",
                    "modelId": "SM-N960U1",
                    "formFactor": "PHONE",
                    "platform": "ANDROID",
                    "os": "8.1.0"
                },
                {
                    "arn": "arn:aws:devicefarm:us-west-2::device:DD61B8C65B1C46A9B3D5285A448BB4A4",
                    "name": "Samsung Galaxy A40",
                    "manufacturer": "Samsung",
                    "model": "Galaxy A40",
                    "modelId": "SM-A405F",
                    "formFactor": "PHONE",
                    "platform": "ANDROID",
                    "os": "9"
                },
                {
                    "arn": "arn:aws:devicefarm:us-west-2::device:5BF61FBF6FDA465EB4BE75C879918585",
                    "name": "Apple iPhone 7 Plus",
                    "manufacturer": "Apple",
                    "model": "iPhone 7 Plus",
                    "modelId": "{A1661,MNR12}",
                    "formFactor": "PHONE",
                    "platform": "IOS",
                    "os": "10.2"
                },
                {
                    "arn": "arn:aws:devicefarm:us-west-2::device:AF74786682D3407D89BD16557FEE97A9",
                    "name": "Apple iPhone 8",
                    "manufacturer": "Apple",
                    "model": "iPhone 8",
                    "modelId": "A1863",
                    "formFactor": "PHONE",
                    "platform": "IOS",
                    "os": "12.0"
                },
                {
                    "arn": "arn:aws:devicefarm:us-west-2::device:D125AEEE8614463BAE106865CAF4470E",
                    "name": "Apple iPhone X",
                    "manufacturer": "Apple",
                    "model": "iPhone X",
                    "modelId": "A1865",
                    "formFactor": "PHONE",
                    "platform": "IOS",
                    "os": "12.0"
                },
                {
                    "arn": "arn:aws:devicefarm:us-west-2::device:8DCCC145A8A54191B61C6EF67F27F507",
                    "name": "Apple iPhone 11 Pro Max",
                    "manufacturer": "Apple",
                    "model": "Apple iPhone 11 Pro Max",
                    "modelId": "MWGY2LL/A",
                    "formFactor": "PHONE",
                    "platform": "IOS",
                    "os": "13.1.3"
                },
                {
                    "arn": "arn:aws:devicefarm:us-west-2::device:A9AD8EC023394AC2BFC5148593BD6883",
                    "name": "Apple iPhone 11",
                    "manufacturer": "Apple",
                    "model": "Apple iPhone 11",
                    "modelId": "MWL72LL/A",
                    "formFactor": "PHONE",
                    "platform": "IOS",
                    "os": "13.3.1"
                }
            ],
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            selectedDevice: {}
        }
        this.handleCreateProjectClose = this.handleCreateProjectClose.bind(this)
        this.allocateDevice = this.allocateDevice.bind(this);
        this.validateDetails = this.validateDetails.bind(this);
    }

    componentDidMount() {
        this.setState({
            selectedDevice: this.state.devices[0]
        })
    }

    allocateDevice = (event) => {
        event.preventDefault();
        let url = process.env.REACT_APP_BACKEND_URL + '/devices/project/' + this.props.id + '/emulators';
        var data = {
            "projectId": this.props.id,
            "deviceType": "emulator",
            "start_time": this.state.startDate + 'T' + this.state.startTime + ':00Z',
            "end_time": this.state.endDate + 'T' + this.state.endTime + ':00Z',
            "name": this.state.selectedDevice.name,
            "osType": this.state.selectedDevice.platform,
            "osVersion": this.state.selectedDevice.os,
            "arn": this.state.selectedDevice.arn
        }
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.handleCreateProjectClose()
                    this.props.fetchDevices()
                } else {
                }
            })
            .catch((error) => {
            });
    }

    changeHandler = (index) => {
        this.setState({
            selectedDevice: this.state.devices[index]
        })
    }
    validateDetails = (event) => {
        if (this.state.startTime !== "" && this.state.startDate !== "" && this.state.endTime !== "" && this.state.endDate !== "") {
            return false
        }
        else return true
    }

    handleCreateProjectClose = () => {
        this.props.toggleCreate();
    }

    startDateChangeHandler = (event) => {
        this.setState({
            startDate: event.target.value
        })
    }
    startTimeChangeHandler = (event) => {
        this.setState({
            startTime: event.target.value
        })
    }
    endDateChangeHandler = (event) => {
        this.setState({
            endDate: event.target.value
        })
    }
    endTimeChangeHandler = (event) => {
        this.setState({
            endTime: event.target.value
        })
    }
    render() {
        return (
            <div>
                <Dialog fullWidth open={this.enableCreate} onClose={this.handleCreateProjectClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Allocate a New Emulator</DialogTitle>
                    <DialogContent>
                        <form>
                            <div class="row" style={{ marginLeft: "10px" }}>
                                <div class="col-md-6">
                                    <div class="row">
                                        <b>Start Time</b>
                                    </div>
                                    <div class="row">
                                        <TextField
                                            id="date"
                                            label="Date"
                                            type="date"
                                            defaultValue={new Date().toISOString().slice(0, 10)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={this.startDateChangeHandler}
                                        />
                                        <TextField
                                            id="time"
                                            label="Time"
                                            type="time"
                                            defaultValue="10:10"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                step: 1800,
                                            }}
                                            onChange={this.startTimeChangeHandler}
                                        />
                                    </div>
                                </div>
                                <div class="col-md-5">
                                    <div class="row">
                                        <b>End Time</b>
                                    </div>
                                    <div class="row">
                                        <TextField
                                            id="date"
                                            label="Date"
                                            type="date"
                                            defaultValue={new Date().toISOString().slice(0, 10)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={this.endDateChangeHandler}
                                        />
                                        <TextField
                                            id="time"
                                            label="Time"
                                            type="time"
                                            defaultValue="10:10"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                step: 1800,
                                            }}
                                            onChange={this.endTimeChangeHandler}
                                        />
                                    </div>
                                </div>
                            </div>
                            <br /><br />
                            <b style={{ marginBottom: "5px" }}>Select A Device</b>
                            {this.state.devices.map((device, index) => {
                                return (
                                    <div class="form-check" style={{ margin: "2px", border: "0.2px solid #dcdee0", padding: "2px 8px 2px", color: "#636363" }}>
                                        <input class="form-check-input" type="radio" name="devices" id={device.arn} value={device.arn} onChange={() => this.changeHandler(index)} />
                                        <label class="form-check-label" for={device.arn} style={{ marginLeft: "5px" }}>
                                            {device.name} - {device.platform} - {device.os}
                                        </label>
                                    </div>
                                )
                            })}
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCreateProjectClose} color="primary">
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.allocateDevice}
                            disabled={this.validateDetails()}
                        >
                            Allocate
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default AllocateDevice;