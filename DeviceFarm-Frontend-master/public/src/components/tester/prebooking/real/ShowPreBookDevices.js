import React, { useState } from 'react';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import Axios from 'axios';
import SelectPreBookDevice from './SelectPreBookDevice';

function ShowPreBookDevices(props) {
  let [devicesResp,setdevicesResp] = useState({show: false, devices: null});
  if(devicesResp.show && !devicesResp.devices){
    let url = `${process.env.REACT_APP_BACKEND_URL}/devices/prebook`
    let params = {
      deviceType: 'real'
    };
    Axios.get(url,{params: params}).then(resp =>{
      if(resp.status === 200 && resp.data.devices){
        setdevicesResp({show: true, devices: resp.data.devices})
      }
    })
  };
  return (
    <div>
      <Button variant="primary" onClick={e => setdevicesResp({show: true,devices: devicesResp.devices})}>
        Allocate a New Device
      </Button>
      <Modal id='pre-booking' size="lg" show={devicesResp.show} onHide={e => setdevicesResp({show: false,devices: devicesResp.devices})}>
        <Modal.Header closeButton>
          <Modal.Title>PreeBooking heading</Modal.Title>
        </Modal.Header>
        <Modal.Body size="lg">
          <SelectPreBookDevice setAllocations={props.setAllocations}devices={devicesResp.devices} projectId={props.projectId}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={e => setdevicesResp({show: false,devices: devicesResp.devices})}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ShowPreBookDevices;