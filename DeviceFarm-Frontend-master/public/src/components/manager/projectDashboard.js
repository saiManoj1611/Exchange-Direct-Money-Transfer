import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tests from './tests';
import Home from './home';
import Bugs from './bugs';
import Testers from './testers';
import Devices from './devices';
import Emulators from './emulators';
import Billing from './projectBilling';
import Cost from './cost';
import '../../App.css';
import EmulatorTests from '../tester/EmulatorTests';

class ProjectDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {},
            tab: 0
        }
        this.getProjectInfo = this.getProjectInfo.bind(this)
        this.handleTabChange = this.handleTabChange.bind(this)
    }

    componentDidMount() {
        this.getProjectInfo();
    }

    handleTabChange = (event, newValue) => {
        this.setState({
            tab: newValue
        })
    }

    getProjectInfo = () => {
        const { match: { params } } = this.props;
        let url = process.env.REACT_APP_BACKEND_URL + '/project/' + params.id;
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        project: response.data
                    })
                } else {
                    this.setState({
                        project: {}
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    project: {}
                })
            });
    }

    render() {
        let currentTab = null;
        if (this.state.tab === 0) currentTab = <Home project={this.state.project} getProjectInfo={this.getProjectInfo} />
        if (this.state.tab === 1) currentTab = <Testers project={this.state.project} getProjectInfo={this.getProjectInfo} />
        if (this.state.tab === 2) currentTab = <Devices project={this.state.project} getProjectInfo={this.getProjectInfo} />
        if (this.state.tab === 3) currentTab = <Emulators project={this.state.project} getProjectInfo={this.getProjectInfo} />
        if (this.state.tab === 4) currentTab = <div><Tests project={this.state.project} />
        <EmulatorTests project={this.state.project._id}/></div>
        if (this.state.tab === 5) currentTab = <Bugs project={this.state.project} getProjectInfo={this.getProjectInfo} />
        if (this.state.tab === 6) currentTab = <Billing project={this.state.project}  />
        return (
            <div className="container" style={{ width: "100%", textAlign: "center", marginTop: "0px" }}>
                <Tabs
                    value={this.state.tab}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleTabChange}
                    variant="fullWidth"
                    style={{ backgroundColor: "#fff", border: "0.1px solid teal", margin: "0px", marginBottom: "3px", boxShadow: "0 2px 5px rgba(0,0,0,0.3)" }}
                >
                    <Tab className="tabselect" label="Home" style={{ fontSize: "13px", color: "black", border: "0.1px solid teal" }} />
                    <Tab className="tabselect" label="Testers" style={{ fontSize: "13px", color: "black", border: "0.1px solid teal" }} />
                    <Tab className="tabselect" label="Real Devices" style={{ fontSize: "13px", color: "black", border: "0.1px solid teal" }} />
                    <Tab className="tabselect" label="Emulators" style={{ fontSize: "13px", color: "black", border: "0.1px solid teal" }} />
                    <Tab className="tabselect" label="Tests" style={{ fontSize: "13px", color: "black", border: "0.1px solid teal" }} />
                    <Tab className="tabselect" label="Bugs" style={{ fontSize: "13px", color: "black", border: "0.1px solid teal" }} />
                    <Tab className="tabselect" label="Cost" style={{ fontSize: "13px", color: "black", border: "0.1px solid teal" }} />
                </Tabs>
                {currentTab}
            </div>
        )
    }
}

export default ProjectDashboard;