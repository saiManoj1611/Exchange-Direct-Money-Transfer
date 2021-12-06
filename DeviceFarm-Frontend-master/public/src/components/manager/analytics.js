import React, { Component } from 'react';
import {
    ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, Scatter,PieChart, Pie, Sector, Cell
} from 'recharts';
const data01 = [
    { name: 'Group A', value: 400 }, { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 },
];
const data02 = [
    { name: 'A1', value: 100 },
    { name: 'A2', value: 300 },
    { name: 'B1', value: 100 },
    { name: 'B2', value: 80 },
    { name: 'B3', value: 40 },
    { name: 'B4', value: 30 },
    { name: 'B5', value: 50 },
    { name: 'C1', value: 100 },
    { name: 'C2', value: 200 },
    { name: 'D1', value: 150 },
    { name: 'D2', value: 50 },
];


export default class Analytics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    name: 'January', uv: 590, Runs: 800, Amount: 1400, cnt: 490,
                },
                {
                    name: 'Febraury', uv: 868, Runs: 900, Amount: 1506, cnt: 590,
                },
                {
                    name: 'March', uv: 1397, Runs: 509, Amount: 989, cnt: 350,
                },
                {
                    name: 'April', uv: 1480, Runs: 620, Amount: 1228, cnt: 480,
                },
                {
                    name: 'May', uv: 1520, Runs: 110, Amount: 1100, cnt: 460,
                },
                {
                    name: 'June', uv: 1400, Runs: 680, Amount: 1700, cnt: 380,
                },
            ]
        }
        this.changeData = this.changeData.bind(this);
    }
    changeData = (event) => {
        
        this.setState({
            data: [
                {
                    name: 'January', uv: 590, Runs: 800, Amount: 1000, cnt: 490,
                },
                {
                    name: 'Febraury', uv: 868, Runs: 1000, Amount: 906, cnt: 590,
                },
                {
                    name: 'March', uv: 1397, Runs: 809, Amount: 989, cnt: 350,
                },
                {
                    name: 'April', uv: 1480, Runs: 620, Amount: 128, cnt: 480,
                },
                {
                    name: 'May', uv: 1520, Runs: 410, Amount: 1000, cnt: 460,
                },
                {
                    name: 'June', uv: 1400, Runs: 780, Amount: 1200, cnt: 380,
                },
                {
                    name: 'July',  Runs: 780
                }
            ]
        })
    }
    render() {
        return (
            <div className="">
                <div className="col-md-6">
                    <ComposedChart
                        width={500}
                        height={400}
                        data={this.state.data}
                        margin={{
                            top: 20, right: 20, bottom: 20, left: 20,
                        }}
                    >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {/* <Area type="monotone" dataKey="Amount" fill="#8884d8" stroke="#8884d8" /> */}
                        <Bar dataKey="Runs" barSize={20} fill="#413ea0" />
                        {/* <Line type="monotone" dataKey="uv" stroke="#ff7300" /> */}
                        {/* <Scatter dataKey="cnt" fill="red" /> */}
                    </ComposedChart>
                    <input type="button" value="Change Project" onClick={this.changeData} />
                </div>
                <div className="col-md-4">
                    New Graph
                    {/* <PieChart width={500} height={500}>
                        <Pie data={data01} dataKey="value" cx={200} cy={200} outerRadius={60} fill="#8884d8" />
                        <Pie data={data02} dataKey="value" cx={200} cy={200} innerRadius={70} outerRadius={90} fill="#82ca9d" label />
                    </PieChart> */}
                </div>
            </div>
        );
    }
}
