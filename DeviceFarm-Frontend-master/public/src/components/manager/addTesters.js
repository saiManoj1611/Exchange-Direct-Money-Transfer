import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class AddTesters extends Component {
    constructor(props) {
        super(props);
        this.enableAdd = this.props.enableAdd;
        this.state = {
            name: "",
            testers: [],
            testersList: [],
            loading: false
        }
        this.handleCreateProjectClose = this.handleCreateProjectClose.bind(this)
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.addTesters = this.addTesters.bind(this);
        this.validateDetails = this.validateDetails.bind(this);
        this.handleTestersList = this.handleTestersList.bind(this);
    }

    componentDidMount() {
        let url = process.env.REACT_APP_BACKEND_URL + '/project/' + this.props.projectId + '/testers?isFree=true';
        this.setState({
            loading: true
        })
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        testers: response.data,
                        loading: false
                    })
                } else {
                    this.setState({
                        testers: [],
                        loading: false
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    testers: [],
                    loading: false
                })
            });
    }

    addTesters = (event) => {
        event.preventDefault();
        let url = process.env.REACT_APP_BACKEND_URL + '/project/' + this.props.projectId + '/testers';
        axios.put(url, this.state.testersList)
            .then(response => {
                if (response.status === 200) {
                    this.handleCreateProjectClose()
                    this.props.updateTesters()
                    this.setState({
                        testersList: []
                    })
                } else {
                }
            })
            .catch((error) => {
            });
    }

    nameChangeHandler = (event) => {
        this.setState({
            title: event.target.value
        })
    }
    validateDetails = (event) => {
        if (this.state.testersList.length === 0) return true
        else return false
    }

    handleCreateProjectClose = () => {
        this.props.toggleAddTesters();
        this.setState({
            testersList: []
        })
    }
    handleTestersList = (event) => {
        let testers = this.state.testersList;
        let index = testers.indexOf(event.target.value)
        if (index === -1) testers.push(event.target.value)
        else testers.splice(index, 1)
        this.setState({
            testersList: testers
        })
    }
    render() {
        let errorBanner = null;
        if (this.state.testers.length === 0 && !this.state.loading) errorBanner = (<b style={{ marginLeft: "80px" }}>No Testers Available to Add</b>)
        return (
            <div>
                <Dialog fullWidth open={this.enableAdd} onClose={this.handleCreateProjectClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add Testers to the Project</DialogTitle>
                    {errorBanner}
                    <DialogContent>
                        {this.state.testers.map((tester, index) => {
                            return (
                                <div className="row" style={{ marginLeft: "20px", fontSize: "18px" }} id={tester._id} key={tester._id}>
                                    <FormControl component="fieldset" >
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<Checkbox value={tester._id} color="primary" onChange={this.handleTestersList} />}
                                                label={tester.name + ' - ' + tester.email}
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </div>
                            )
                        })}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCreateProjectClose} color="primary">
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.addTesters}
                            disabled={this.validateDetails()}
                        >
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default AddTesters;