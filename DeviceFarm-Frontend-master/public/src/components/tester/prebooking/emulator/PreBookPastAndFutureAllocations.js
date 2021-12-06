import React from 'react';
import { Button, Table } from 'react-bootstrap';
import Axios from 'axios';
import { Link } from 'react-router-dom';

function PreBookFutureAllocations(props) {
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
          <td ><Link to={`/tester/${allocation.tester}/project/${allocation.project._id}/allocation/${allocation._id}/tests?isActive=false`}>{allocation.device.deviceId}</Link></td>
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

export default PreBookFutureAllocations;