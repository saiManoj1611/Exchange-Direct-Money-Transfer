import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import Typography from '@material-ui/core/Typography';
import Loading from '../loading';
import Alert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router';
import Axios from 'axios';

function DeviceIcons(props) {
  const [loading, setLoading] = useState({status: false, text: ''});
  const [errorMsg, setErrorMsg] = useState(null);
  const [redirectTag, setRedirectTag] = useState(null);
  let createRemoteSession = (allocation) => {
    if(!props.allowCreateSession){
      return false;
    }
    let formData = {
      tester: sessionStorage.getItem('id'),
      project: allocation.projectId,
      name: allocation.name,
      arn: allocation.arn,
      allocationType: 'prebook'
    }
    let url = `${process.env.REACT_APP_BACKEND_URL}/remoteAccessSession`;
    setLoading({status: true,text: 'Initializing a remote instance!!'});
    Axios.post(url,formData,{validateStatus: false}).then(resp => {
      if(resp.status===200 && resp.data){
        setRedirectTag(<Redirect to={`/project/${allocation.projectId}/remoteAccessSession/${resp.data.remoteSession._id}`} />);
      }else{
        setErrorMsg(<Alert variant='danger'>{resp.data.error || 'Something went wrong, please try again later'}</Alert>);
        setLoading({status: false, text: null});
      }
    })
  }
  return (
    <div className="row">
      <Loading loading={loading.status} locadingText={loading.text}/>
      {errorMsg}
      {redirectTag}
      {props.allocations.map(allocation =>{
        return (
          <div className="col-md-3" style={{  marginTop: "5px", marginBottom: "5px", paddingLeft: "0px" }}>
              <Card onClick={e => createRemoteSession(allocation)} className="cardBox" style={{ backgroundColor: "#b8babf" }}>
                  <CardContent className="cardBoxColor" style={{ paddingBottom: "10px", paddingTop: "10px" }}>
                      <div>
                          {allocation.osType === 'Android' ? (
                            <PhoneAndroidIcon style={{ fontSize: 85, color: "#081d40" }} />
                          ) : (
                            <PhoneIphoneIcon style={{ fontSize: 85, color: "#081d40" }} />
                          )}
                          
                      </div>
                      <div style={{ fontSize: "14px", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                          <h4>{allocation.name}</h4>
                          <div class="row" style={{ paddingLeft: "0px" }}>
                              <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-time"></span>
                                  &nbsp;{new Date(allocation.start_time).toLocaleString('en-US')}
                              </Typography>
                          </div>
                          <div class="row">
                          <Typography color="" variant="h6" style={{ display: "inline" }}><span class="glyphicon glyphicon-time"></span>
                                  &nbsp;{new Date(allocation.end_time).toLocaleString('en-US')}
                              </Typography>
                          </div>
                      </div>
                  </CardContent>
              </Card>
          </div>
        )
        })}
      </div>
  );
}

export default DeviceIcons;