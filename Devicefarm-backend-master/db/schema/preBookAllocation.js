const mongoose = require('mongoose');
let {PreBookDevice} = require('./preBookDevice')

const PreBookAllocationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  deviceType: {
    type: String,
    required: true,
    enum: ['emulator', 'real']
  },
  name: {
    type: String,
    required: true
  },
  osType: {
    type: String,
    required: true,
    enum: ['ANDROID', 'IOS']
  },
  osVersion: {
    type: String,
    required: true,
  },
  arn: {
    type: String,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
    default: 'available',
    enum: [
      'available',
      'allocated',
      'maintenance'
    ]
  }
})

PreBookAllocationSchema.statics.allocateDevice = async function(data){
  let preBookDevice = await PreBookDevice.findById(data.device);
  if(!preBookDevice){
    throw new Error(`Device not present`);
  }
  let preBookAllocation = new this(data);
  await preBookAllocation.save().catch(e => {throw(e)});
  return preBookAllocation
}


module.exports.PreBookAllocation = mongoose.model.PreBookAllocation || mongoose.model('PreBookAllocation',PreBookAllocationSchema)