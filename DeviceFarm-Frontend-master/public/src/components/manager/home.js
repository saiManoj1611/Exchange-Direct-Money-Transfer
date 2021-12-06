import React, { Component } from 'react';
import {
    ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, Scatter, PieChart, Pie, Sector, Cell
} from 'recharts';
import _ from 'lodash';
import axios from 'axios';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data02: [

            ],
            data01: { name: 'Total Devices Allocated', value: 10 },
            totaldevice: 0
        }
    }

    componentWillReceiveProps(nextProps){
        this.fetchDevicesList()
        this.fetchTestResultsList()
    }

    componentDidMount() {
        this.props.getProjectInfo()
    }

    fetchDevicesList() {
        let url = `${process.env.REACT_APP_BACKEND_URL}/allocations/prebook`;
        let param = {
            projectId: this.props.project._id
        }
        axios.defaults.withCredentials = true;
        axios.get(url, { params: param })
            .then(response => {
                if (response.status === 200) {
                    console.log(this.state.data01)
                    console.log({ name: "Total Device Allocated", value: response.data.allocations.currentAllocations.length })
                    this.setState({
                        totaldevice: response.data.allocations.currentAllocations.length,
                        data01: [{ name: "Total Device Allocated", value: response.data.allocations.currentAllocations.length }]
                    })
                }
            })
            .catch((error) => {
            });
    }

    fetchTestResultsList() {
        let url = `${process.env.REACT_APP_BACKEND_URL}/project/${this.props.project._id}/aggrTests`;
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {  
                    this.setState({
                        data02: response.data
                    })
                }
            })
            .catch((error) => {
            });
    }

    render() {
        return (
            <div className="">
                <div className="col-md-6">
                    <h2 style={{ marginTop: "20px", marginBottom: "10px" }}>{this.props.project.name}</h2>
                    <h5 style={{ marginTop: "0px", marginBottom: "30px" }}>{this.props.project.description}</h5>
                    <h4 style={{ marginBottom: "10px", textDecoration: "underline" }}>Project Details</h4>
                    <table class="table table-striped table-dark" style={{ width: "350px", marginLeft: "120px" }}>
                        <tbody>
                            <tr class="bg-dark" style={{ textAlign: "center", backgroundColor: "black" }}>
                                <th class="bg-dark" scope="row" style={{ textAlign: "center", color: "white" }}>Manager Name</th>
                                <td class="bg-dark" style={{ textAlign: "center", color: "white" }}>{_.isUndefined(this.props.project.managerId) ? "" : this.props.project.managerId.name}</td>
                            </tr>
                            <tr class="bg-dark" style={{ textAlign: "center", backgroundColor: "black" }}>
                                <th class="bg-dark" scope="row" style={{ textAlign: "center", color: "white" }}>Manager Email</th>
                                <td class="bg-dark" style={{ textAlign: "center", color: "white" }}>{_.isUndefined(this.props.project.managerId) ? "" : this.props.project.managerId.email}</td>
                            </tr>
                            <tr class="bg-dark" style={{ textAlign: "center", backgroundColor: "black" }}>
                                <th class="bg-dark" scope="row" style={{ textAlign: "center", color: "white" }}>No of Testers in the Project</th>
                                <td class="bg-dark" style={{ textAlign: "center", color: "white" }}>{_.isUndefined(this.props.project.testers) ? "0" : this.props.project.testers.length}</td>
                            </tr>
                            <tr class="bg-dark" style={{ textAlign: "center", backgroundColor: "black" }}>
                                <th class="bg-dark" scope="row" style={{ textAlign: "center", color: "white" }}>Total number of Tests</th>
                                <td class="bg-dark" style={{ textAlign: "center", color: "white" }}>{this.props.project.tests}</td>
                            </tr>
                            <tr class="bg-dark" style={{ textAlign: "center", backgroundColor: "black" }}>
                                <th class="bg-dark" scope="row" style={{ textAlign: "center", color: "white" }}>No of Bugs in the Project</th>
                                <td class="bg-dark" style={{ textAlign: "center", color: "white" }}>{this.props.project.bugs}</td>
                            </tr>
                            <tr class="bg-dark" style={{ textAlign: "center", backgroundColor: "black" }}>
                                <th class="bg-dark" scope="row" style={{ textAlign: "center", color: "white" }}>No of Devices allocated</th>
                                <td class="bg-dark" style={{ textAlign: "center", color: "white" }}>{this.state.totaldevice}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-md-4">
                <PieChart width={400} height={400} style={{ padding: "0px" }}>
                        <Pie data={this.state.data01} isAnimationActive={true} dataKey="value" cx={200} cy={200} outerRadius={60} fill="#8884d8" />
                        <Pie data={this.state.data02} dataKey="value" cx={200} cy={200} innerRadius={70} outerRadius={120} fill="#82ca9d" label />
                        <Tooltip />
                    </PieChart>
                    <b>Device Allocation and Test Status</b>
                </div>
            </div>
        );
    }
}
