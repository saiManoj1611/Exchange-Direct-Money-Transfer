import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

class CreateBug extends Component {
    constructor(props) {
        super(props);
        this.enableCreate = this.props.enableCreate;
        this.state = {
            name: "",
            description: "",
            priority: ""
        }
        this.handleCreateProjectClose = this.handleCreateProjectClose.bind(this)
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.createProject = this.createProject.bind(this);
        this.validateDetails = this.validateDetails.bind(this);
    }

    createProject = (event) => {
        event.preventDefault();
        let url = process.env.REACT_APP_BACKEND_URL + '/project/' + this.props.id + '/bugs';
        var data = {
            "name": this.state.title,
            "description": this.state.description,
            "priority": this.state.priority,
            "loggedOn": new Date().toISOString().slice(0, 10),
            "projectId": this.props.id,
            "testerId": sessionStorage.getItem("id")
        }
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.handleCreateProjectClose()
                    this.props.updateProjects()
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
    priorityChangeHandler = (event) => {
        this.setState({
            priority: event.target.value
        })
    }
    descriptionChangeHandler = (event) => {
        this.setState({
            description: event.target.value
        })
    }
    validateDetails = (event) => {
        if (this.state.title !== "") return false
        else return true
    }

    handleCreateProjectClose = () => {
        this.props.toggleCreate();
    }
    render() {
        return (
            <div>
                <Dialog fullWidth open={this.enableCreate} onClose={this.handleCreateProjectClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create New Bug</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                required
                                autoComplete="off"
                                onChange={this.nameChangeHandler}
                            />
                            <TextField
                                margin="dense"
                                id="priority"
                                label="Priority"
                                type="text"
                                fullWidth
                                variant="outlined"
                                required
                                autoComplete="off"
                                onChange={this.priorityChangeHandler}
                            />
                            <TextField
                                margin="dense"
                                id="description"
                                label="Description"
                                type="description"
                                fullWidth
                                multiline
                                rows="3"
                                autoComplete="off"
                                variant="outlined"
                                placeholder="Description"
                                required
                                onChange={this.descriptionChangeHandler}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCreateProjectClose} color="primary">
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.createProject}
                            disabled={this.validateDetails()}
                        >
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default CreateBug;