let {OnDemandDevice} = require('./../db/schema/onDemandDevice');
let {PreBookAllocation} = require('./../db/schema/preBookAllocation')
let {PreBookDevice} = require('./../db/schema/preBookDevice');

module.exports.getAvailableOnDemandDevices = (req,resp) => {
  OnDemandDevice.find(req.query).then(devices => {
    resp.json({devices: devices})
  })
}
module.exports.createOnDemandDevice = (req,resp) => {
  let onDemandDevice = new OnDemandDevice(req.body); 
  onDemandDevice.save().then(_ => {
    resp.json({success: true})
  })
}

module.exports.getAvailablePreBookDevices = (req,resp) => {
  PreBookAllocation.find({ projectId: req.params.id, deviceType:"real" }).then(devices => {
    resp.json({devices: devices})
  })
}

module.exports.createPreBookDevice = (req,resp) => {
  let preBookDevice = new PreBookAllocation(req.body); 
  preBookDevice.save().then(_ => {
    resp.json({success: true})
  })
}

module.exports.getAvailablePreBookEmulators = (req,resp) => {
  PreBookAllocation.find({ projectId: req.params.id, deviceType:"emulator" }).then(devices => {
    resp.json({devices: devices})
  })
}
module.exports.createPreBookEmulator = (req,resp) => {
  let preBookEmulator = new PreBookAllocation(req.body); 
  preBookEmulator.save().then(_ => {
    resp.json({success: true})
  })
}
