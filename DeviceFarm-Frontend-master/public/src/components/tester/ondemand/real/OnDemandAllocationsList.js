import React from 'react';
import { Button, Table } from 'react-bootstrap';
import Axios from 'axios';
import { Link } from 'react-router-dom';

function OnDemandAllocationsList(props) {
  let allocations = props.allocations;

  let handleDeallocate = (allocationId) => {
    let url = `${process.env.REACT_APP_BACKEND_URL}/allocations/ondemand/${allocationId}/deallocate/real`
    Axios.post(url).then(resp =>{
      if(resp.status === 200 && resp.data.success){
        props.setAllocations({status: 'loading'});
      }
    });
  };
  return (
    <Table striped bordered hover>
    <thead>
      <tr>
        <td>Device Id</td>
        <td>Device Name</td>
        <td>Device Type</td>
        <td>OS Type</td>
        <td>OS Version</td>
        <td>Allocation Start Time</td>
        <td>Allocation End Time</td>
      </tr>
    </thead>
    <tbody>
      {allocations.map( allocation => {
        let deallocationTag = null;
        if(allocation.ended){
          deallocationTag = new Date(allocation.ended).toLocaleString();
        }else{
          deallocationTag = <Button variant='primary' onClick={e =>handleDeallocate(allocation._id)}>Deallocate</Button>
        }
        return <tr>
          <td >
            {allocation.ended === undefined ? (<Link to={`/tester/${allocation.tester}/project/${allocation.project._id}/allocation/${allocation._id}/tests/ondemand/create`}><Button variant='primary'>Create Test Run</Button></Link>) :
            (allocation.device.deviceId)
            }
          </td>
          <td >{allocation.device.name}</td>
          <td >{allocation.device.deviceType}</td>
          <td >{allocation.device.osType}</td>
          <td >{allocation.device.osVersion}</td>
          <td >{new Date(allocation.started).toLocaleString()}</td>
          <td >{deallocationTag}</td>
        </tr>
      })}
    </tbody>
  </Table>
  );
}

export default OnDemandAllocationsList;