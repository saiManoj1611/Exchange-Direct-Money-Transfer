import React, { useState } from 'react';
import { useParams, Redirect } from 'react-router';
import Axios from 'axios';
import Farmer from '../../../farmer';
import { Row, Col } from 'react-bootstrap';
import { Container, Grid, Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Fab from "@material-ui/core/Fab";
import { Link } from 'react-router-dom';
import Loading from './../../loading';
import Alert from '@material-ui/lab/Alert';

function RemoteAccessSession(props) {
  let {id, projectId} = useParams();
  let [remoteSessionResp,setremoteSessionResp] = useState({status: 'loading',remoteSession: null});
  let [redirectTag, setRedirectTag] = useState(null);
  let [uploadMsg,setUploadMsg] = useState(null);
  let [loading,setLoading] = useState({status: false,text: ''});
  const [deviceX,setdeviceX] = useState(null); 
  const [deviceY,setdeviceY] = useState(null);
  if(remoteSessionResp.status === 'loading'){
    let url = `${process.env.REACT_APP_BACKEND_URL}/remoteAccessSession/${id}`
    Axios.get(url).then(resp =>{
      if(resp.status === 200 && resp.data){
        let remoteSession = resp.data.remoteSession;
        if(remoteSession.sessionDetails.endpoint){
          let deviceX = remoteSession.sessionDetails.device.resolution.width;
          let deviceY = remoteSession.sessionDetails.device.resolution.height;
          Farmer().mount({
            endpoint: remoteSession.sessionDetails.endpoint,
            elementId: 'container',
            dimensions: {x: 600 * 3/4, y: 1024 * 3/4},
            deviceResolution: deviceX && deviceY ? { x: deviceX, y: deviceY } : undefined,
            logCallback: function(state, message) { }
          })
        }
        setremoteSessionResp({status: 'loaded',remoteSession: remoteSession});
      }
    })
  }

  const handleAppFileUpload = (e) =>{
    e.preventDefault();
    let form = e.currentTarget;
    let fdata = new FormData();
    fdata.append('files',form.elements.appFile.files[0]);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    let url = `${process.env.REACT_APP_BACKEND_URL}/remoteAccessSession/${id}/installApp`
    setLoading({
      status: true,
      text: "uploading your App!"
    })
    Axios.post(url, fdata, config)
        .then(response => {
          setLoading({
            loading: false,
            loadingText: ""
          })
          if (response.status === 200 && !response.data.err) {
              setUploadMsg(<Alert severity="success">App uploaded!</Alert>)
            }else{
              setUploadMsg(<Alert severity="error">Some thing went wrong!</Alert>);
            }
        })
        .catch((error) => {
          setLoading({
                loading: false,
                loadingText: "",
            })
          setUploadMsg(<Alert severity="error">{error}</Alert>);
        });
  }

  const  handleStopSession = () =>{
    let url = `${process.env.REACT_APP_BACKEND_URL}/remoteAccessSession/${id}/stop`;
    if(!remoteSessionResp.remoteSession.sessionDetails.endpoint){
      setremoteSessionResp({status: 'session closed',remoteSession: remoteSessionResp});
    }else {
      Axios.get(url).then(resp =>{
        if(resp.status === 200 && resp.data){
          setRedirectTag(<Redirect to={`/project/${projectId}/dashboard`}/>)
          setremoteSessionResp({status: 'session closed',remoteSession: resp.data.remoteSession});
        }
      })
    }
  }
  let contentTag = null;
  if(remoteSessionResp.status === 'loading'){
    contentTag =  <h2>Loading...</h2>
  }
  else if(!remoteSessionResp.remoteSession.sessionDetails.endpoint){
    contentTag = <h2>Session expired!</h2>
  }else {
    contentTag = <div id="sse">
        <br/>
        <br/>
        <br/>
        <Button variant="contained" color="secondary" onClick={handleStopSession}>
          Stop Session
        </Button>
        <br/>
        <br/>
        <br/>
        <form onSubmit={handleAppFileUpload}>
          <div className="row" style={{'text-align': 'left', 'margin-left': '0px'}}>
            <label style={{ lineHeight: "45px", padding: "0px"}}>Upload your Application</label>
          </div>
          <div className="row">
            {uploadMsg}
          </div>
          <div className="row">
          <input type="file"
              required
              name='appFile'
              className="form-control"
              multiple=""
              accept=".apk,.ipa"
              style={{ display: 'inline', width: "200px", backgroundColor: "white" }}>
          </input>&nbsp;&nbsp;
          <Button type="submit" variant="contained" color="primary" style={{ padding: "8px 10px 8px", fontSize: "12px" }}>
              Upload
          </Button>
          </div>
        </form>
      </div>
  }

  return (
    <div className="container" style={{ width: "80%", align: "center", marginTop: "20px" }}>
      <Loading loading={loading.status} loadingText={loading.text}/>
      {redirectTag}
      <br/>
      <br/>
      <br/>
      <br/>
      <Grid container spacing={3}>
      <Grid item xs={3}>
      </Grid>
      <Grid item xs={6} style={{textAlign: 'center'}}>
        <div id="terminal">
          <div id="container">
          </div>
        </div>
      </Grid>
      <Grid item xs={3} style={{'text-align':'center'}}>
        {contentTag}
      </Grid>
    </Grid>
    </div>
  );
}

export default RemoteAccessSession;