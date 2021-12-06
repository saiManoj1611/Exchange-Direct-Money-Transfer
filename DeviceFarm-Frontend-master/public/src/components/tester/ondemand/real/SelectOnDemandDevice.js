import React, { useState } from 'react';
import { Button, Modal, Table, Form, Radio, Alert } from 'react-bootstrap';
import Axios from 'axios';
import Loading from '../../loading';
import { Redirect } from 'react-router';

function SelectOnDemandDevice(props) {
  let [errorMsg, setErrorMsg] = useState(null);
  let [loading,setLoading] = useState({status: false,text: ''});
  let [redirectTag, setRedirectTag] = useState(null);
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
    let selectedDevice = (Array.from(form.selectedDevice).find(device => device.checked) || {}).value;
    if(!selectedDevice){
      return setErrorMsg(<Alert variant='danger'>No device selected</Alert>);
    }
    let formData = {
      tester: sessionStorage.getItem('id'),
      project: props.projectId,
      name: selectedDevice.split('|')[0],
      arn: selectedDevice.split('|')[1],
      allocationType: 'ondemand'
    }
<<<<<<< HEAD:src/components/tester/emulators/SelectOnDemandDevice.js
    let url = `${process.env.REACT_APP_BACKEND_URL}/remoteAccessSession`;
    setLoading({status: true,text: 'Initializing a remote instance!!'});
=======
    let url = `${process.env.REACT_APP_BACKEND_URL}/allocations/ondemand/real`;
>>>>>>> billing:src/components/tester/ondemand/real/SelectOnDemandDevice.js
    Axios.post(url,formData,{validateStatus: false}).then(resp => {
      if(resp.status===200 && resp.data){
        setRedirectTag(<Redirect to={`/project/${props.projectId}/remoteAccessSession/${resp.data.remoteSession._id}`} />);
      }else{
        setErrorMsg(<Alert variant='danger'>{resp.data.error || 'Something went wrong, please try again later'}</Alert>);
        setLoading({status: false, text: null});
      }
    })
  }
  return (
    <Form onSubmit={handleSubmit}>
      {redirectTag}
      <Loading loading={loading.status} loadingText={loading.text} />
      {errorMsg}
    <Table striped bordered hover>
      <thead>
        <tr>
        <td>Select</td>
        <td>Device Name</td>
        <td>Device Type</td>
        <td>OS Type</td>
        <td>OS Version</td>
        </tr>
      </thead>
      <tbody>
          {devices.map(device => {
            return  <tr>
              <td><Radio type='checkbox' name='selectedDevice' value={`${device.name}|${device.arn}`}></Radio></td>
              <td>{device.name}</td>
              <td>{device.deviceType}</td>
              <td>{device.osType}</td>
              <td>{device.osVersion}</td>
            </tr>
          })}
      </tbody>
    </Table>
    <div className='text-right'>
      <Button variant="primary" type='submit'>
      Create Remote Access
      </Button>
    </div>
    </Form>
  );
}

export default SelectOnDemandDevice;