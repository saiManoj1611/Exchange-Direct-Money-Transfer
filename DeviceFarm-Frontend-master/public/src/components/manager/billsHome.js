import React, { Component } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, BarChart, Bar, Cell,
} from 'recharts';
import axios from 'axios';

class Bills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedProject: 'all',
      selectedBillingPeriod: 'all',
      billingDetails: []
    }

  }

  onChangeProject = (e) => {
    var res = this.props.deviceMindetails.filter(deviceMindetail => deviceMindetail.projectName === e.target.value);

    if (e.target.value == 'all') {
      this.setState({
        selectedProject: 'all',
        selectedBillingPeriod: 'all',
        data: []
      })
    }
    else {
      this.setState({
        selectedProject: e.target.value,
        data: res[0].data,
        selectedBillingPeriod: 'all'
      })
    }
  }


  render() {
    let graph = null
    let graph_project =
      <LineChart width={500} height={450} data={this.state.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" label={{ value: "Billing Period", position: "insideBottomRight", dy: 7 }} />
        <YAxis label={{ value: "Amount", position: "insideLeft", angle: -90, dy: -10 }} />
        <Tooltip />
        <Line type="monotone" dataKey="DeviceMinutes" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="MonthlyCost" stroke="#82ca9d" />
      </LineChart>

    let graph_billing_period =
      <BarChart width={500} height={450} data={this.state.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" label={{ value: "Billing Period", position: "insideBottomRight", dy: 7 }} />
        <YAxis label={{ value: "Amount", position: "insideLeft", angle: -90, dy: -10 }} />
        <Tooltip />
        <Bar dataKey="DeviceMinutes" fill="#8884d8" />
        <Bar dataKey="MonthlyCost" fill="#82ca9d" />
      </BarChart>

    if (this.state.selectedBillingPeriod === 'all' && this.state.selectedProject === 'all') {
      graph = <h>Please select project or billing period to view usage metrics</h>;
    }
    else if (this.state.selectedProject != 'all' && this.state.selectedBillingPeriod === 'all') {
      graph = graph_project;
    }
    else if (this.state.selectedProject != 'all' && this.state.selectedBillingPeriod != 'all') {
      graph = graph_billing_period;
    }

    return (
      <div style={{ marginTop: "40px", overflowX: "hidden", overflowY: "hidden" }}>
        <div className="container" style={{ width: "920px", backgroundColor: "white", borderRadius: "7px", padding: "30px 40px 60px" }}>
          <div style={{ padding: "0px 0px 70px 0px" }}>
            <h2 style={{ textAlign: "center" }}>Cost Management Console</h2>
            <br />
            <div className="dropdown" style={{ float: "left" }}>
              <select ref="userInput"
                required
                style={{ width: "400px" }}
                className="form-control"
                value={this.state.selectedProject}
                onChange={this.onChangeProject}>
                <option key='all' value='all'>List of Projects</option>
                {
                  this.props.projects.map((project) => {
                    return <option key={project} value={project}>{project}</option>
                  })
                }
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Bills;