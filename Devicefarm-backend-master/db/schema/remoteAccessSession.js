const mongoose = require('mongoose');
let {OnDemandDevice} = require('./onDemandDevice')
let {PreBookDevice} = require('./preBookDevice')
const {createRemoteAccessSession, 
  stopRemoteAccessSession,
  getRemoteAccessSession
} = require('./../../DeviceFarm/devicefarmSession');

const RemoteAccessSessionSchema = new mongoose.Schema({
  sessionDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  tester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tester',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  allocationType: {
    type: String,
    enum: ['ondemand','prebook']
  }
},{
  timestamps: true
})

RemoteAccessSessionSchema.statics.createRemoteAccessSession = async function(data){
  const sessionResp = await createRemoteAccessSession({
    name: data.name + ' - ' + data.tester,
    deviceArn: data.arn
  });
  if(sessionResp.err){
    throw new Error(`Cannot allocate a device`);
  }
  let remoteAccessSessionData = {
    sessionDetails: sessionResp.data.remoteAccessSession,
    tester: data.tester,
    project: data.project,
    allocationType: data.allocationType,
  };
  let remoteAccessSession = new this(remoteAccessSessionData);
  await remoteAccessSession.save().catch(e => {throw(e)});
  return remoteAccessSession
}

RemoteAccessSessionSchema.statics.stopRemoteAccessSession = async function(id){
  let remoteAccessSession = await this.findById(id);
  const sessionResp = await stopRemoteAccessSession(remoteAccessSession.sessionDetails.arn);
  if(sessionResp.err){
    console.log(sessionResp.err);
    throw new Error('error occured');
  }
  remoteAccessSession.sessionDetails = sessionResp.data.remoteAccessSession;
  await remoteAccessSession.save();
  return remoteAccessSession
}

RemoteAccessSessionSchema.statics.updateRemoteAccessSession = async function(sessionIds){
  let i;
  let remoteAccessSessions = [];
  for(i=0;i<sessionIds.length;i++){
    const remoteAccessSession = await this.findById(sessionIds[i]);
    const sessionResp = await getRemoteAccessSession(remoteAccessSession.sessionDetails.arn);
    remoteAccessSession.sessionDetails = sessionResp.data.remoteAccessSession;
    await remoteAccessSession.save();
    remoteAccessSessions.push(remoteAccessSession);
  }
  return remoteAccessSessions;
}


module.exports.RemoteAccessSession = mongoose.model.RemoteAccessSession || mongoose.model('RemoteAccessSession',RemoteAccessSessionSchema)
