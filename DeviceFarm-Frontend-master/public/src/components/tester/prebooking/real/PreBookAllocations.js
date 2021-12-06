import React, { useState } from 'react';
import { useParams } from 'react-router';
import Axios from 'axios';
import ShowPreBookDevices from './ShowPreBookDevices';
import PreBookPastAndFutureAllocations from './PreBookPastAndFutureAllocations';
import CurrentAllocations from './CurrentAllocations';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Fab from "@material-ui/core/Fab";
import { Link } from 'react-router-dom';

function PreBookAllocations(props) {
  let {testerId,projectId} = useParams();
  let [allocationResp,setAllocations] = useState({status: 'loading',allocations: {},childMsg:null});
  let params = {
    tester: testerId,
    project: projectId,
    deviceType: 'real',
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
      <Link to={`/tester/${testerId}/project/${projectId}/prebooking_device_types`} style={{ textDecoration: "none" }}>
          <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "rgb(225, 225, 225)" }} >
              <ArrowBackIcon fontSize="large" /><b style={{ fontSize: "10px" }}> Back</b>
          </Fab>
      </Link>
    </div>
    <div className="row">
      <h2>Pre-Book Allocated Real Devices</h2>
      <ShowPreBookDevices setAllocations={setAllocations} projectId={projectId}/>
      <h3>Current Allocations</h3>
      <CurrentAllocations setAllocations={setAllocations} allocations={allocationResp.allocations.futureAllocations}/>
    </div>
    <div className="row">
      <h3>Future Allocations</h3>
      <PreBookPastAndFutureAllocations setAllocations={setAllocations} allocations={allocationResp.allocations.futureAllocations}/>
    </div>
    <div className="row">
      <h3>Past Allocations</h3>
      <PreBookPastAndFutureAllocations setAllocations={setAllocations} allocations={allocationResp.allocations.pastAllocations}/>
    </div>
  </div>
}

export default PreBookAllocations;