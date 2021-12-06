import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

class CreateProject extends Component {
    constructor(props) {
        super(props);
        this.enableCreate = this.props.enableCreate;
        this.state = {
            name: "",
            description: ""
        }
        this.handleCreateProjectClose = this.handleCreateProjectClose.bind(this)
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.createProject = this.createProject.bind(this);
        this.validateDetails = this.validateDetails.bind(this);
    }

    createProject = (event) => {
        event.preventDefault();
        let url = process.env.REACT_APP_BACKEND_URL + '/projects/' + sessionStorage.getItem("id");
        var data = {
            "name": this.state.title,
            "description": this.state.description
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
                    <DialogTitle id="form-dialog-title">Create New Project</DialogTitle>
                    <DialogContent>
                        <form>
                            <b>Name</b>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                name="name"
                                label="Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                required
                                autoComplete="off"
                                onChange={this.nameChangeHandler}
                            />
                            <br/><br/>
                            <b>Description</b>
                            <textarea
                                rows={4}
                                name="description"
                                id="description"
                                style={{ width: "100%" }}
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

export default CreateProject;