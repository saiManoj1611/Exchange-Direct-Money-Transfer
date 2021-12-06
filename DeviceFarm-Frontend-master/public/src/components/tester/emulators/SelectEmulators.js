import React, { useState } from 'react';
import { useParams } from 'react-router';
import Axios from 'axios';
import DeviceIcons from './../DeviceIcons';
import ShowOnDemandDevices from './ShowOnDemandDevices';

function SelectEmulators(props) {
  let {testerId,projectId} = props;
  let [allocationResp,setAllocations] = useState({status: 'loading',allocations: {},childMsg:null});
  let params = {
    projectId: projectId,
    deviceType: 'emulator',
  }
  let url = `${process.env.REACT_APP_BACKEND_URL}/allocations/prebook`;
  if(allocationResp.status === 'loading'){
    Axios.defaults.withCredentials = true;
    Axios.get(url,{params: params}).then(resp =>{
      if(resp.status === 200 && resp.data.allocations){
        setAllocations({ status:'loaded', allocations: resp.data.allocations });
      }
    });
  }
  if(allocationResp.status === 'loading'){
    return <div>Loading...</div>
  }
  return <div className="container" style={{ width: "80%", align: "center", marginTop: "20px" }}>
    <div className="row">
      <ShowOnDemandDevices projectId={projectId} testerId={testerId}/>
    </div>
    <div className="row">
      <h2>Current Allocations</h2>
      {(allocationResp.allocations.currentAllocations.length < 1) ? (
        <h4>No devices booked for now!</h4>
      ) 
      : 
      (
        <DeviceIcons allowCreateSession={true} allocations={allocationResp.allocations.currentAllocations}/>
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

export default SelectEmulators;