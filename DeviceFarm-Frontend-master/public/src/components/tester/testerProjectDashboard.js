import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Home from './home';
import Bugs from './bugs';
import Analytics from './cost';
import RealDevices from './realdevices/SelectRun';
import Emulators from './emulators/SelectEmulators';
import '../../App.css';
import AllTests from './AllTests';

class TesterProjectDashboard extends Component {
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
        if (this.state.tab === 1) currentTab = <RealDevices projectId={this.state.project._id} testerId={sessionStorage.getItem('id')} />
        if (this.state.tab === 2) currentTab = <Emulators projectId={this.state.project._id} testerId={sessionStorage.getItem('id')} />
        if (this.state.tab === 3) currentTab = <AllTests project={this.state.project} tester={sessionStorage.getItem('id')}/>
        if (this.state.tab === 4) currentTab = <Bugs project={this.state.project} getProjectInfo={this.getProjectInfo} />
        if (this.state.tab === 5) currentTab = <Analytics project={this.state.project}/>
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
                    <Tab className="tabselect" label="Real Devices" style={{ fontSize: "13px", color: "black", border: "0.1px solid teal" }} />
                    <Tab className="tabselect" label="Emulators" style={{ fontSize: "13px", color: "black", border: "0.1px solid teal" }} />
                    <Tab className="tabselect" label="Tests" style={{ fontSize: "13px", color: "black", border: "0.1px solid teal" }} />
                    <Tab className="tabselect" label="Bugs" style={{ fontSize: "13px", color: "black", border: "0.1px solid teal" }} />
                    <Tab className="tabselect" label="Analytics" style={{ fontSize: "13px", color: "black", border: "0.1px solid teal" }} />
                </Tabs>
                {currentTab}
            </div>
        )
    }
}

export default TesterProjectDashboard;