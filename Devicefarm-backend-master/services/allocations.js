const logger = require('tracer').colorConsole();
let {OnDemandAllocation} = require('./../db/schema/onDemandAllocation');
let {PreBookAllocation} = require('./../db/schema/preBookAllocation');
let {OnDemandDevice} = require('./../db/schema/onDemandDevice');
let {PreBookDevice} = require('./../db/schema/preBookDevice');
let {RemoteAccessSession} = require('./../db/schema/remoteAccessSession');

const {getRemoteAccessSession} = require('./../DeviceFarm/devicefarmSession');

module.exports.getAllOnDemandAllocations = async (req, resp) => {
  let deviceType = req.query.deviceType || 'real';
  delete req.query.deviceType;
  let devices = await OnDemandDevice.find({deviceType: deviceType}).select('_id');
  let deviceIds = devices.map(device => device._id.toString());
  req.query.device = {$in: deviceIds};
  OnDemandAllocation.find(req.query || {})
    .populate('projectId')
    .sort('end_time')
    .then(allocations => {
      resp.json({allocations});
    })
  }
  

module.exports.getAllPreBookAllocations = async (req, resp) => {
  let allPreBookAllocations = await PreBookAllocation.find(req.query || {})
    .populate('projectId')
  let allocations = {
    pastAllocations: [],
    currentAllocations: [],
    futureAllocations: []
  }
  let currentTime = new Date();
  allPreBookAllocations.forEach(allocation => {
    if(new Date(allocation.end_time) < currentTime){
      allocations.pastAllocations.push(allocation);
    }else if(new Date(allocation.start_time) > currentTime){
      allocations.futureAllocations.push(allocation);
    }else if(new Date(allocation.start_time) < currentTime && new Date(allocation.end_time) > currentTime){
      allocations.currentAllocations.push(allocation);
    }else{
      logger.error(`allocation does not match any of the conditions - ${JSON.stringify(allocation)}`)
    }
  })
  resp.json({allocations});
}

module.exports.createOnDemandAllocationEmulator = async (req, resp, next) => {
  await RemoteAccessSession.allocateDeviceEmulator(req.body).catch(e => next(e));
  resp.json({success: true});
}

module.exports.createOnDemandAllocationReal = async (req, resp, next) => {
  let i;
  for(i=0;i<req.body.devices.length;i++){
    device = req.body.devices[i];
    let data = {
      tester: req.body.tester,
      project: req.body.project,
      device: device,
    }
    await OnDemandAllocation.allocateDeviceReal(data).catch(e => next(e));
  }
  resp.json({success: true});
}

module.exports.createPreBookAllocation = (req, resp, next) => {
  req.body.devices.forEach(device =>{
    let data = {
      tester: req.body.tester,
      project: req.body.project,
      device: device.deviceId,
      start_time: device.startTime,
      end_time: device.endTime
    }
    PreBookAllocation.allocateDevice(data).then(_ => {
      resp.json({success: true});
    }).catch(e => next(e));
  })
}

module.exports.updateOnDemandAllocationStatusEmulator = async (req, resp) => {
  const allocations = await OnDemandAllocation.updateAllocationStatusEmulator(req.body.allocationIds || []);
  resp.json(allocations);
}

module.exports.getOnDemandAllocation = (req, resp) => {
  OnDemandAllocation.findById(req.params.id).populate('device').then(onDemandAllocation => {
    resp.json(onDemandAllocation);
  });
}

module.exports.onDemandDeallocateEmulator = (req, resp, next) => {
  OnDemandAllocation.deallocateDeviceEmulator(req.params.id).then(_ => {
      resp.json({success: true});
  }).catch(e => next(e));
}

module.exports.onDemandDeallocateReal = (req, resp, next) => {
  OnDemandAllocation.deallocateDeviceReal(req.params.id).then(_ => {
      resp.json({success: true});
  }).catch(e => next(e));
}



module.exports.getPreBookAllocation = (req, resp) => {
  PreBookAllocation.findById(req.params.id).populate('device').then(onDemandAllocation => {
    resp.json(onDemandAllocation);
  });
}

module.exports.getTesterBillingPeriods = (req, resp, next) => {
  OnDemandAllocation.find({ tester: req.params.id })
    .then(BillingPeriods => {
      resp.json({BillingPeriods});
    }).catch(e => next(e));
};

module.exports.getProjectAllocationDetails = (req, resp, next) => {
OnDemandAllocation.find({ project: req.params.project_id })
.then(AllocationDetails => {
  resp.json({AllocationDetails});
}).catch(e => next(e));
};

module.exports.getOnDemandAllocationDetails = (req, resp, next) => {
  OnDemandAllocation.find()
  .then(AllocationDetails => {
    resp.json({AllocationDetails});
  }).catch(e => next(e));
  };
