const mongoose = require('mongoose');
let {OnDemandDevice} = require('./onDemandDevice')
const {createRemoteAccessSession, stopRemoteAccessSession,getRemoteAccessSession} = require('./../../DeviceFarm/devicefarmSession');


const OnDemandAllocationSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OnDemandDevice'
  },
  tester: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'tester'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'projects'
  },
  started: {
    type: Date,
    required: true,
    default: Date.now
  },
  ended: {
    type: Date,
  },
  sessionDetails:{
    type: mongoose.Schema.Types.Mixed
  }
})

OnDemandAllocationSchema.statics.allocateDeviceEmulator = async function(data){
  let onDemandDevice = await OnDemandDevice.findById(data.device);
  if(!onDemandDevice || onDemandDevice.status !== 'available'){
    throw new Error(`Device already in use`);
  }
  const sessionResp = await createRemoteAccessSession({
    name: onDemandDevice.name + ' - ' + data.tester,
    deviceArn: onDemandDevice.arn
  });
  if(sessionResp.err){
    throw new Error(`Cannot allocate a device`);
  }
  data.sessionDetails = sessionResp.data;
  let onDemandAllocation = new this(data);
  await onDemandAllocation.save().catch(e => {throw(e)});
  return onDemandAllocation
}

OnDemandAllocationSchema.statics.allocateDeviceReal = async function(data){
  let onDemandDevice = await OnDemandDevice.findById(data.device);
  if(!onDemandDevice || onDemandDevice.status !== 'available'){
    throw new Error(`Device already in use`);
  }
  let onDemandAllocation = new this(data);
  await onDemandAllocation.save().catch(e => {throw(e)});
  return onDemandAllocation
}

OnDemandAllocationSchema.statics.deallocateDeviceEmulator = async function(id){
  let onDemandAllocation = await this.findById(id);
  const sessionResp = await stopRemoteAccessSession(onDemandAllocation.sessionDetails.remoteAccessSession.arn);
  if(sessionResp.err){
    console.log(sessionResp.err);
    throw new Error('error occured');
  }
  onDemandAllocation.ended = Date.now();
  onDemandAllocation.sessionDetails = sessionResp.data;
  await onDemandAllocation.save();
  return onDemandAllocation
}

OnDemandAllocationSchema.statics.deallocateDeviceReal = async function(id){
  let onDemandAllocation = await this.findById(id);
  onDemandAllocation.ended = Date.now();
  await onDemandAllocation.save();
  return onDemandAllocation
}

OnDemandAllocationSchema.statics.updateAllocationStatusEmulator = async function(allocationIds){
  let i;
  let allocations = [];
  for(i=0;i<allocationIds.length;i++){
    const allocation = await this.findById(allocationIds[i]);
    const sessionResp = await getRemoteAccessSession(allocation.sessionDetails.remoteAccessSession.arn);
    allocation.sessionDetails = sessionResp.data;
    await allocation.save();
    allocations.push(allocation);
  }
  return allocations;
}


module.exports.OnDemandAllocation = mongoose.model.OnDemandAllocation || mongoose.model('OnDemandAllocation',OnDemandAllocationSchema)