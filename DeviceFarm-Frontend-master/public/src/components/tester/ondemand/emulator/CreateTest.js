import React, { useState } from 'react';
import { useParams } from 'react-router';
import Axios from 'axios';
import { Row, Col, Form, Button, Alert, Label, FormControl, FormGroup } from 'react-bootstrap';
import { TextField } from '@material-ui/core';

function CreateTest(props) {
  let {allocationId,projectId,testerId} = useParams();
  let [message,setMessage] = useState(null);
  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    // set the with credentials to true
    Axios.defaults.withCredentials = true;
    // make a post request with the user data
    let url = `${process.env.REACT_APP_BACKEND_URL}/devicefarm/createRun`;
    const formData = new FormData();
    formData.append('allocation', allocationId,);
    formData.append('project', projectId,);
    formData.append('tester', testerId,);
    formData.append('testName', form.testName.value,);
    formData.append('file', form.elements.apk.files[0]);
    formData.append('appFileType', 'ANDROID_APP');
    formData.append('script', form.elements.script.files[0]);
    Axios.defaults.withCredentials = false;
    Axios.post(url,formData,{validateStatus: false}).then(resp => {
      if(resp.status === 200 && resp.data.success){
        form.reset();
        setMessage(<Alert variant='success'>Test created</Alert>);
      }else{
        setMessage(<Alert variant='danger'>{resp.data.error}</Alert>);
      }
    })
  }
  return (
    <div className="container" style={{ width: "80%", align: "center", marginTop: "20px" }}>
      <div className="row">
        <h3>Create New Test</h3>
        <Row>
          <Col>
            <Form onSubmit={handleSubmit}>
              {message}
              <FormGroup>
                <FormControl type='text' name='testName' required placeholder='Test Name'/>
              </FormGroup>
              <FormGroup>
                <FormControl type='text' name='testDescription' placeholder='Test Description' required/>
              </FormGroup>
              <FormGroup>
                <div>Upload Application</div>
                <FormControl type='file' name='apk' accept=".apk" placeholder='Test Description' required/>
              </FormGroup>
              <FormGroup>
                <div>Upload Test Script</div>
                <FormControl type='file' name='script' accept=".zip" placeholder='Test Description' required/>
              </FormGroup>
              <Button variant="primary" type="submit">
                Create
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default CreateTest;