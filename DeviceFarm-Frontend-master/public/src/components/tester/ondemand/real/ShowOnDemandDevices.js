import React, { useState } from 'react';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import Axios from 'axios';
import SelectOnDemandDevice from './SelectOnDemandDevice';
import Fab from "@material-ui/core/Fab";
<<<<<<< HEAD:src/components/tester/emulators/ShowOnDemandDevices.js
import Icon from '@material-ui/core/Icon';
=======
import AddIcon from "@material-ui/icons/Add";
>>>>>>> billing:src/components/tester/ondemand/real/ShowOnDemandDevices.js

function ShowOnDemandDevices(props) {
  let [devicesResp,setdevicesResp] = useState({show: false, devices: null});
  if(devicesResp.show && !devicesResp.devices){
    let params = {
      status: 'available',
<<<<<<< HEAD:src/components/tester/emulators/ShowOnDemandDevices.js
      deviceType: 'emulator'
=======
      deviceType: 'real'
>>>>>>> billing:src/components/tester/ondemand/real/ShowOnDemandDevices.js
    };
    let url = `${process.env.REACT_APP_BACKEND_URL}/devices/ondemand`;
    Axios.get(url,{params: params}).then(resp =>{
      if(resp.status === 200 && resp.data.devices){
        setdevicesResp({show: true, devices: resp.data.devices})
      }
    })
  };
  return (
    <div>
      <Fab variant="extended" style={{ alignContent: "right", backgroundColor: "white" }} onClick={e => setdevicesResp({show: true,devices: devicesResp.devices})}>
<<<<<<< HEAD:src/components/tester/emulators/ShowOnDemandDevices.js
        <Icon color="primary">add_circle</Icon><b style={{ fontSize: "10px" }}>&nbsp;Create a New Remote Session</b>
=======
          <AddIcon /><b style={{ fontSize: "10px" }}>Allocate a New Device</b>
>>>>>>> billing:src/components/tester/ondemand/real/ShowOnDemandDevices.js
      </Fab>
      <Modal show={devicesResp.show} onHide={e => setdevicesResp({show: false,devices: devicesResp.devices})}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SelectOnDemandDevice testerId={props.testerId} devices={devicesResp.devices} projectId={props.projectId}/>
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

export default ShowOnDemandDevices;