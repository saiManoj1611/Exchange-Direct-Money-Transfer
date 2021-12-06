import React from 'react';
import { Button, Table } from 'react-bootstrap';
import Axios from 'axios';
import { Link } from 'react-router-dom';

function CurrentAllocations(props) {
  let allocations = props.allocations;
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
        return <tr>
<<<<<<< HEAD
<<<<<<< HEAD
          <td ><Link to={`/tester/${allocation.tester}/project/${allocation.project._id}/allocation/${allocation._id}/tests/prebook/create`}><Button variant='primary'>Create Test Run</Button></Link></td>
=======
          <td ><Link to={`/tester/${allocation.tester}/project/${allocation.project._id}/allocation/${allocation._id}/tests?isActive=true`}>{allocation.device.deviceId}</Link></td>
>>>>>>> ondemand prebooking real and emulator
=======
          <td ><Link to={`/tester/${allocation.tester}/project/${allocation.project._id}/allocation/${allocation._id}/tests/prebook/create`}><Button variant='primary'>Create Test Run</Button></Link></td>
>>>>>>> tester view changes
          <td >{allocation.device.name}</td>
          <td >{allocation.device.deviceType}</td>
          <td >{allocation.device.osType}</td>
          <td >{allocation.device.osVersion}</td>
          <td >{new Date(allocation.started).toLocaleString()}</td>
          <td >{new Date(allocation.ended).toLocaleString()}</td>
        </tr>
      })}
    </tbody>
  </Table>
  );
}

export default CurrentAllocations;