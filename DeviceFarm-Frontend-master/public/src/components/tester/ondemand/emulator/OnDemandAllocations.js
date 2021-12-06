import React, { useState } from 'react';
import { useParams } from 'react-router';
import Axios from 'axios';
import ShowOnDemandDevices from './ShowOnDemandDevices';
import OnDemandAllocationsList from './OnDemandAllocationsList';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Fab from "@material-ui/core/Fab";
import { Link } from 'react-router-dom';

function OnDemandAllocations(props) {
  // let {testerId,projectId} = useParams();
  let {testerId,projectId} = props;
  let [allocationResp,setAllocations] = useState({status: 'loading',allocations: {},childMsg:null});
  let params = {
    tester: testerId,
    project: projectId,
    deviceType: 'emulator',
  }
  let url = `${process.env.REACT_APP_BACKEND_URL}/allocations/ondemand`;
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
      {/* <Link to={`/tester/${testerId}/project/${projectId}/ondemand_device_types`} style={{ textDecoration: "none" }}>
          <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "rgb(225, 225, 225)" }} >
              <ArrowBackIcon fontSize="large" /><b style={{ fontSize: "10px" }}> Back</b>
          </Fab>
      </Link> */}
    </div>
    <div className="row">
      <h3>On Demand Allocated Emulator Devices</h3>
      <ShowOnDemandDevices setAllocations={setAllocations} projectId={projectId}/>
    </div>
    <div className="row">
      <h3>Allocations</h3>
      <OnDemandAllocationsList setAllocations={setAllocations} allocations={allocationResp.allocations}/>
    </div>
  </div>
}

export default OnDemandAllocations;