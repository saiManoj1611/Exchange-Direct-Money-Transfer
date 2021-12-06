import React, { useState } from 'react';
import { useParams } from 'react-router';
import Axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import qs from 'qs';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Fab from "@material-ui/core/Fab";

function ShowTests(props) {
  let {allocationId,testerId,projectId} = useParams();
  let [testResp,setTestResp] = useState({status: 'loading',tests: null});
  if(testResp.status === 'loading'){
    let url = `${process.env.REACT_APP_BACKEND_URL}/tests`
    Axios.get(url,{
      params: {
        allocation: allocationId,
        tester: testerId, 
        project: projectId
      }
    }).then(resp =>{
      if(resp.status===200 && resp.data.tests){
        setTestResp({status: 'loaded',tests: resp.data.tests})
      }else{
        setTestResp({status: 'error',tests: null});
      }
    })
  }
  let testsTag = null;
  if(testResp.status === 'loading'){
    testsTag = <tr><td className='text-center' colSpan='4'>Loading...</td></tr>;
  }else if(testResp.status === 'error'){
    testsTag = <tr><td className='text-center' colSpan='4'>Error in fetching</td></tr>;
  }else{
    if(testResp.tests.length < 1){
      testsTag = <tr><td className='text-center' colSpan='4'>No tests ran on this allocation</td></tr>;
    }else{
      testsTag = testResp.tests.map(test => {
        return <tr>
            <td>{test.testName}</td>
            <td>{test.testDescription}</td>
            <td>{test.status}</td>
          </tr>
      });
    }
  }
  let createNewTestTag = null;
  let isActive = qs.parse(props.location.search, { ignoreQueryPrefix: true }).isActive;
  if(isActive === 'true'){
    createNewTestTag = <Link to={`/tester/${testerId}/project/${projectId}/allocation/${allocationId}/tests/ondemand/create`}><Button variant='primary'>Create New Test</Button></Link>
  }
  return (
    <div className="container" style={{ width: "80%", align: "center", marginTop: "20px" }}>
      <div className="row">
        <Link to={`/tester/${testerId}/project/${projectId}/ondemand_allocations/real`} style={{ textDecoration: "none" }}>
            <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "rgb(225, 225, 225)" }} >
                <ArrowBackIcon fontSize="large" /><b style={{ fontSize: "10px" }}> Back</b>
            </Fab>
        </Link>
      </div>
      <div className="row">
        <h3>Tests run/running on this device</h3>
        {createNewTestTag}
        <Table striped bordered hover>
          <thead>
            <tr>
              <td>Test Name</td>
              <td>Test Description</td>
              <td>Status</td>
            </tr>
          </thead>
          <tbody>
            {testsTag}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ShowTests;