require('dotenv').config();
const logger = require('tracer').colorConsole();
var path = require('path')
const fs = require('fs');
const requestPromise = require('request-promise');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' })

const devicefarm = new AWS.DeviceFarm({
    apiVersion: '2015-06-23',
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION
});

const getRemoteAccessSession = async (sessionArn) => {
  var params = {
    arn: sessionArn
  };
  return await new Promise((resolve, _) => {
    devicefarm.getRemoteAccessSession(params, function(err, data) {
        resolve({
            err: err,
            data: data
        })
      });
  });
}

const getRemoteAccessSessionWhenReady = async (remoteResp) => {
    if(remoteResp.data && remoteResp.data.remoteAccessSession.status !== 'RUNNING'){
        logger.log(remoteResp.data.remoteAccessSession);
        await sleep(1000);
        remoteResp = await getRemoteAccessSessionWhenReady(await getRemoteAccessSession(remoteResp.data.remoteAccessSession.arn))
    }
    return remoteResp;
  }

const triggerCreateRemoteAccessSession = async (sessionData) => {
  var params = {
    name: sessionData.name, 
    configuration: {
     billingMethod: "METERED"
    }, 
    deviceArn: sessionData.deviceArn,
    projectArn: process.env.DEVICE_FARM_PROJECT_ARN// You can get the project ARN by using the list-projects CLI command.
   };
   return await new Promise((resolve, _) => {
    devicefarm.createRemoteAccessSession(params, function(err, data) {
        resolve({
            err: err,
            data: data
        })
    });
  });
}

const createRemoteAccessSession = async (sessionData) => {
    const {err, data} =  await triggerCreateRemoteAccessSession(sessionData);
    if(err){
        return {err: err, data: null}
    }
    const sessionArn = data.remoteAccessSession.arn;
    return await getRemoteAccessSessionWhenReady(await getRemoteAccessSession(sessionArn))
}


const stopRemoteAccessSession = async (sessionArn) => {
  var params = {
    arn: sessionArn
  };
  return await new Promise((resolve, _) => {
    devicefarm.stopRemoteAccessSession(params, function(err, data) {
        resolve({
            err: err,
            data: data
        });
    });
  });
}

const uploadAppFile = async (appFile) => {
  'ANDROID_APP','IOS_APP'
  let applicationParams = {
    name: appFile.originalname,
    type: path.extname(appFile.originalname) === ".apk" ? 'ANDROID_APP':'IOS_APP',
    projectArn: process.env.DEVICE_FARM_PROJECT_ARN
};
  let applicationFile = await devicefarm.createUpload(applicationParams).promise()
  logger.debug(applicationFile)
  let options = {
      method: 'PUT',
      url: applicationFile.upload.url,
      headers: {},
      body: fs.readFileSync('./public/files/' + appFile.originalname)
  };
  await requestPromise(options)
  let applicationFileUploadStatus = applicationFile.upload.status
  while (applicationFileUploadStatus !== "SUCCEEDED") {
      await sleep(3000);
      applicationFileUploadStatus = (await devicefarm.getUpload({ arn: applicationFile.upload.arn }).promise()).upload.status;
      logger.debug("Application File Upload Status :: ", applicationFileUploadStatus);
  }
  fs.unlink('./public/files/' + appFile.originalname, () => { })
  logger.debug("Application File ARN :: " + applicationFile.upload.arn)
  return applicationFile.upload.arn;
}

const installToRemoteAccessSession = async (file,sessionArn) => {
  var params = {
    appArn: await uploadAppFile(file),
    remoteAccessSessionArn: sessionArn
  }
  let resp =  await new Promise((resolve, _) => {
    devicefarm.installToRemoteAccessSession(params, function(err, data) {
      resolve({
          err: err,
          data: data
      });
    });
  });
  return resp;
}

module.exports.createRemoteAccessSession = createRemoteAccessSession;
module.exports.getRemoteAccessSession = getRemoteAccessSession;
module.exports.getRemoteAccessSessionWhenReady = getRemoteAccessSessionWhenReady;
module.exports.stopRemoteAccessSession = stopRemoteAccessSession;
module.exports.installToRemoteAccessSession = installToRemoteAccessSession;
