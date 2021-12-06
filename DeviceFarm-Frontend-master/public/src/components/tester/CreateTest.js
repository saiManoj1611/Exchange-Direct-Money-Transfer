import React, { useState } from 'react';
import { useParams } from 'react-router';
import Axios from 'axios';
import { Row, Col, Form, Button, Alert, Label } from 'react-bootstrap';
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
    let url = `${process.env.REACT_APP_BACKEND_URL}/tests`;
    let formData = {
      allocation: allocationId,
      project: projectId,
      tester: testerId,
      testName: form.testName.value,
      testDescription: form.testDescription.value
    }
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
            <h2>Sign In</h2>
            <Form onSubmit={handleSubmit}>
              {message}
              <TextField id="standard-basic" label="Test Name" name='testName' required/>
              <br/>
              <TextField id="standard-basic" label="Test Description" name='testDescription'required />
              <br/>
              <br/>
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