import React, { useState } from 'react';
import { useParams } from 'react-router';
import Axios from 'axios';
import Farmer from '../../../../farmer';
import { Row, Col, Button } from 'react-bootstrap';
import { Container, Grid } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Fab from "@material-ui/core/Fab";
import { Link } from 'react-router-dom';

function ShowOnDemandAllocation(props) {
  let {allocationId,testerId,projectId} = useParams();
  let [allocationResp,setallocationResp] = useState({status: 'loading',allocation: null});
  const [deviceX,setdeviceX] = useState(null); 
  const [deviceY,setdeviceY] = useState(null);
  if(allocationResp.status === 'loading'){
    let url = `${process.env.REACT_APP_BACKEND_URL}/allocations/ondemand/${allocationId}`
    Axios.get(url).then(resp =>{
      if(resp.status===200 && resp.data){
        setallocationResp({status: 'loaded',allocation: resp.data})
      }else{
        setallocationResp({status: 'error',allocation: null});
      }
    })
  }
  const  handleLaunchFarmer = () =>{
    if(!allocationResp.allocation.sessionDetails.remoteAccessSession.endpoint){
      setallocationResp({status: 'session closed',allocation: allocationResp.allocation});
    }else{
      Farmer().mount({
        endpoint: allocationResp.allocation.sessionDetails.remoteAccessSession.endpoint,
        elementId: 'container',
        dimensions: {x: 600 * 3/4, y: 1024 * 3/4},
        deviceResolution: deviceX && deviceY ? { x: deviceX, y: deviceY } : undefined,
        logCallback: function(state, message) { }
      });
    }
  }
  let contentTag = null;
  if(allocationResp.status === 'loading'){
    contentTag =  <h2>Loading...</h2>
  }
  else if(allocationResp.status === 'session closed'){
    contentTag = <h2>Session expired!</h2>
  }else {
    contentTag = <div>
      <div id="sse">
        <Button id="run" type="button" onClick={handleLaunchFarmer}>Launch Device</Button>
      </div>
      <div id="terminal">
        <div id="container">
        </div>
      </div>
  </div>
  }

  return (
    <div className="container" style={{ width: "80%", align: "center", marginTop: "20px" }}>
      <div className="row">
        <Link to={`/tester/${testerId}/project/${projectId}/ondemand_allocations/emulator`} style={{ textDecoration: "none" }}>
            <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "rgb(225, 225, 225)" }} >
                <ArrowBackIcon fontSize="large" /><b style={{ fontSize: "10px" }}> Back</b>
            </Fab>
        </Link>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <Grid container spacing={3}>
      <Grid item xs={4}>
      </Grid>
      <Grid item xs={4} style={{textAlign: 'center'}}>
        {contentTag}
      </Grid>
      <Grid item xs={4}>
      </Grid>
    </Grid>
    </div>
  );
}

export default ShowOnDemandAllocation;