import React, { useState } from 'react';
import { Button, Modal, Table, Form, Checkbox, Alert, FormControl } from 'react-bootstrap';
import Axios from 'axios';
import $ from 'jquery';

function SelectPreBookDevice(props) {
  let [errorMsg, setErrorMsg] = useState(null);
  let devices = props.devices || [];
  let availabeDeviceTag = null;
  if(devices === null){
    availabeDeviceTag = <tr><td colspan='5' className='text-center'>Loading..</td></tr>
  }
  else if(devices && devices.length < 1){
    availabeDeviceTag = <tr><td colspan='5' className='text-center'>Sorry, no avilable devices at this moment. Please check after some time</td></tr>
  }else{
  }
  let handleSubmit = (e) =>{
    e.preventDefault();
    let form = e.currentTarget;
    let devices = Array.from($('#prebook-device-form').find('tr.devices').find('input[type=checkbox]:checked').map(function(){
      return ({
      deviceId: $(this).val(),
      startTime:$(this).closest('tr').find('.startTime').val(),
      endTime: $(this).closest('tr').find('.endTime').val()
      })
    }));
    let formData = {
      tester: sessionStorage.getItem('id'),
      project: props.projectId,
      devices: devices
    }
    let url = `${process.env.REACT_APP_BACKEND_URL}/allocations/prebook`;
    Axios.post(url,formData,{validateStatus: false}).then(resp => {
      if(resp.status===200 && resp.data.success){
        props.setAllocations({status: 'loading'});
      }else{
        setErrorMsg(<Alert variant='danger'>{resp.data.error}</Alert>);
      }
    })
  }
  return (
    <Form id='prebook-device-form' onSubmit={handleSubmit}>
      {errorMsg}
    <Table fluid striped bordered hover>
      <thead>
        <tr>
        <td>Select</td>
        <td>Device Name</td>
        <td>Device Type</td>
        <td>OS Type</td>
        <td>OS Version</td>
        <td>Start Date Time</td>
        <td>End Date Time</td>
        </tr>
      </thead>
      <tbody>
          {devices.map(device => {
            return  <tr className='devices' id={device._id}>
              <td><Checkbox className='selectedDevices' type='checkbox' name='selectedDevices' value={device._id}></Checkbox></td>
              <td>{device.name}</td>
              <td>{device.deviceType}</td>
              <td>{device.osType}</td>
              <td>{device.osVersion}</td>
              <td><FormControl className="startTime" type="datetime-local" name="startTime" min={new Date().toISOString().split('T')[0]}/></td>
              <td><FormControl className="endTime" type="datetime-local" name="endTime" min={new Date().toISOString().split('T')[0]}/></td>
            </tr>
          })}
      </tbody>
    </Table>
    <div className='text-right'>
      <Button variant="primary" type='submit'>
      Add Device
      </Button>
    </div>
    </Form>
  );
}

export default SelectPreBookDevice;