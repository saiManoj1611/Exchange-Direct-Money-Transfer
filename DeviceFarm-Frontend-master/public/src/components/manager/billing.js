import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BillsHome from './billsHome';
import Bills from './bills';
import '../../App.css';
import ProjectCost from './projectCosts';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';

class BillsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {},
            tab: 0,
            projects: [],
            currentProject: {}
        }
    }

    componentDidMount() {
        let url = process.env.REACT_APP_BACKEND_URL + '/projects/' + sessionStorage.getItem("id") + '?persona=manager';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    let projectNames = []
                    response.data.forEach(element => {
                        projectNames.push({ "name": element.name, "id": element._id })
                    });
                    this.setState({
                        projects: projectNames,
                        selectedProject: projectNames[0]
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    projects: [],
                    selectedProject: {}
                })
            });
    }

    onChangeProject = (event) => {
        this.setState({
            selectedProject: this.state.projects[_.findIndex(this.state.projects, ['id', event.target.value])]
        })
    }

    render() {
        let graph = null;
        if (!_.isEmpty(this.state.selectedProject)) {
            graph = <ProjectCost project={this.state.selectedProject} />
        }
        return (
            <div className="container" style={{ backgroundColor: "white", marginTop: "10px", overflowX: "hidden", overflowY: "hidden", boxShadow: "0 2px 5px rgba(0,0,0,0.3)" }}>
                <h2 style={{ textAlign: "center", margin: "10px 0px 20px" }}>Cost Management Console</h2>
                <div className="row" style={{textAlign:"-webkit-center"}}>
                <div className="dropdown" style={{ float: "center" }}>
                    <select ref="userInput"
                        required
                        style={{ width: "400px" }}
                        className="form-control"
                        onChange={this.onChangeProject}>
                        {
                            this.state.projects.map((project) => {
                                return <option key={project.id} value={project.id}>{project.name}</option>
                            })
                        }
                    </select>
                </div>
                </div>
                {graph}
                <div style={{textAlign:"-webkit-center"}}>
                    <Button variant="contained" color="primary"><Link to="/manager/viewbills" style={{ color: "white" }}>View Bills</Link></Button>
                </div>
            </div>
        )
    }
};

export default BillsDashboard;