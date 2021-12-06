import React, { Component } from 'react';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, BarChart, Bar, Cell,
  } from 'recharts';

const monthMapping = {'01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May',
'06': 'June', '07': 'July', '08': 'August', '09': 'September', '10': 'October',
'11': 'November', '12': 'December'}

const minCost = 5;

export default class Cost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectAllocationDetails: [],
            selectedBillingPeriod: 'all',
            billingPeriods: [],
            deviceMindetails: [],
            data: null
        }

        this.getProjectAllocationInfo = this.getProjectAllocationInfo.bind(this);
        this.generateData = this.generateData.bind(this);
    }

    componentDidMount() {
        this.props.getProjectInfo();
        this.getProjectAllocationInfo();
    }

    getProjectAllocationInfo = () => {
        let url = process.env.REACT_APP_BACKEND_URL + '/allocations/peojectallocationdetails/' + this.props.project._id;
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    let month_nums = [];
                    let months = [];
                    response.data.AllocationDetails.forEach(element => {
                        if(!month_nums.includes(element.started.split('-')[1])){
                            month_nums.push(element.started.split('-')[1]);
                            months.push(monthMapping[element.started.split('-')[1]]);
                        }
                    });
                    this.setState({
                        billingPeriods: months,
                        projectAllocationDetails: response.data.AllocationDetails
                    })

                    this.generateData(response.data.AllocationDetails);

                } else {
                    this.setState({
                        billingPeriods: [],
                        projectAllocationDetails: [],
                        deviceMindetails: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    billingPeriods: [],
                    projectAllocationDetails: [],
                    deviceMindetails: []
                })
            });

    }

    generateData = (projectAllocationDetails) => {
        let data = [{name:'January', DeviceMinutes: 0, MonthlyCost:0},
                    {name:'February', DeviceMinutes: 0, MonthlyCost:0},
                    {name:'March', DeviceMinutes: 0, MonthlyCost:0},
                    {name:'April', DeviceMinutes: 0, MonthlyCost:0},
                    {name:'May', DeviceMinutes: 0, MonthlyCost:0},
                    {name:'June', DeviceMinutes: 0, MonthlyCost:0},
                    {name:'July', DeviceMinutes: 0, MonthlyCost:0},
                    {name:'August', DeviceMinutes: 0, MonthlyCost:0},
                    {name:'September', DeviceMinutes: 0, MonthlyCost:0},
                    {name:'October', DeviceMinutes: 0, MonthlyCost:0},
                    {name:'November', DeviceMinutes: 0, MonthlyCost:0},
                    {name:'December', DeviceMinutes: 0, MonthlyCost:0}];

        projectAllocationDetails.forEach(allocation => {
            if(allocation.ended != undefined){
                
                let minutes = 0;
                var started_month = allocation.started.split('-')[1];
                var started_month_name = monthMapping[allocation.started.split('-')[1]];
                var started_year = allocation.started.split('-')[0];
                var ended_month_name = monthMapping[allocation.ended.split('-')[1]];
                var start_date = new Date(allocation.started);
                var end_date = new Date(allocation.ended);
                var last_date = new Date(started_year, started_month, 0);

                if(last_date > end_date){
                    var res = Math.abs(end_date - start_date) / 1000;
                    minutes = Math.floor(res / 60) % 60;
                    
                    data.forEach(dataElement => {
                        if(dataElement.name === started_month_name){
                            dataElement.DeviceMinutes += minutes;
                            dataElement.MonthlyCost = minutes*minCost;
                        }
    
                    });
                }
                else{
                    var res = Math.abs(last_date - start_date) / 1000;
                    minutes = Math.floor(res / 60) % 60;

                    data.forEach(dataElement => {
                        if(dataElement.name === started_month_name){
                            dataElement.DeviceMinutes += minutes;
                            dataElement.MonthlyCost = minutes*minCost;
                        }
    
                    });

                    res = Math.abs(end_date - last_date) / 1000;
                    minutes = Math.floor(res / 60) % 60;

                    data.forEach(dataElement => {
                        if(dataElement.name === ended_month_name){
                            dataElement.DeviceMinutes += minutes;
                            dataElement.MonthlyCost = minutes*minCost;
                        }
    
                    });
                }
            }
        });

        this.setState({
            deviceMindetails: data,
            data: data
        })

    }

    onChangeBillingPeriod = (e) => {
        if(e.target.value === 'all'){
            this.setState({
                selectedBillingPeriod: 'all',
                data: this.state.deviceMindetails
            })
        }
        else{
            this.setState({
                selectedBillingPeriod: e.target.value
            })

            this.state.deviceMindetails.forEach(detail => {
                if(detail.name === e.target.value){
                    console.log(detail);
                    this.setState({
                        data: [detail]
                    })
                }
            });
        }
    }

    render() {
        let graph_billing_period = 
        <BarChart width={500} height={450} data={this.state.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: "Billing Period", position: "insideBottomRight", dy: 7}} />
            <YAxis label={{ value: "Amount", position: "insideLeft", angle: -90,   dy: -10}} />
            <Tooltip />
            <Bar dataKey="DeviceMinutes" fill="#8884d8" />
            <Bar dataKey="MonthlyCost" fill="#82ca9d" />
        </BarChart>
        return(
            <div style={{ marginTop: "40px", overflowX: "hidden", overflowY: "hidden" }}>
                <div className="container" style={{ width: "920px", backgroundColor: "white",borderRadius: "7px",padding:"30px 40px 60px" }}>
                    <div style={{ padding:"0px 0px 70px 0px" }}>
                        <div className="dropdown" style={{ float: "left" }}>
                            <select ref="userInput"
                                required
                                style={{ width: "400px" }}
                                className="form-control"
                                value={this.state.selectedBillingPeriod}
                                onChange={this.onChangeBillingPeriod}>
                                <option key='all' value='all'>Billing Period</option>
                                {
                                    this.state.billingPeriods.map((billingPeriod) => {
                                        return <option key={billingPeriod} value={billingPeriod}>{billingPeriod}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <p>Usage Metrics</p>
                        <div style={{ padding:"0px 0px 0px 140px" }}>
                            {graph_billing_period}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}