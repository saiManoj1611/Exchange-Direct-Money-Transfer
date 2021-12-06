import React, { useState } from 'react';
import { useParams } from 'react-router';
import Axios from 'axios';
import DeviceIcons from './../DeviceIcons';
import Icon from '@material-ui/core/Icon';
import Fab from "@material-ui/core/Fab";
import { Link } from 'react-router-dom';

function SelectRun(props) {
  let {testerId,projectId} = props;
  let [allocationResp,setAllocations] = useState({status: 'loading',allocations: {},childMsg:null});
  let params = {
    projectId: projectId,
    deviceType: 'real',
  }
  let url = `${process.env.REACT_APP_BACKEND_URL}/allocations/prebook`;
  if(allocationResp.status === 'loading'){
    Axios.defaults.withCredentials = true;
    Axios.get(url,{params: params}).then(resp =>{
      if(resp.status === 200 && resp.data.allocations){
        console.log(resp.data.allocations)
        setAllocations({ status:'loaded', allocations: resp.data.allocations });
      }
    });
  }
  if(allocationResp.status === 'loading'){
    return <div>Loading...</div>
  }
  return <div className="container" style={{ width: "80%", align: "center", marginTop: "20px" }}>
    <div className="row">
      <Link to={`/tester/${testerId}/project/${projectId}/real_devices/create_run`} style={{ textDecoration: "none" }}>
          <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "#ffffff" }} >
          <Icon color="primary">add_circle</Icon><b style={{ fontSize: "10px" }}>&nbsp;Create a New Run</b>
          </Fab>
      </Link>
    </div>
    <div className="row">
      <h2>Current Allocations</h2>
      {(allocationResp.allocations.currentAllocations.length < 1) ? (
        <h4>No devices booked for now!</h4>
      ) 
      : 
      (
        <DeviceIcons allocations={allocationResp.allocations.currentAllocations}/>
      )}
    </div>
    <div className="row">
      <h2>Future Allocations</h2>
      {(allocationResp.allocations.futureAllocations.length < 1) ? (
        <h4>No devices booked for future!</h4>
      ) 
      : 
      (
        <DeviceIcons allocations={allocationResp.allocations.futureAllocations}/>
      )}
    </div>
  </div>
}

export default SelectRun;