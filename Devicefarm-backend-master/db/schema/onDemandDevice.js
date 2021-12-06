const mongoose = require('mongoose');

const OnDemandDeviceSchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true
  },
  deviceType: {
    type: String,
    required: true,
    enum: ['real','emulator']
  },
  name: {
    type: String,
    required: true
  },
  osType: {
    type: String,
    required: true,
    enum: ['Android','iOS']
  },
  osVersion: {
    type: String,
    required: true,
  },
  arn:{
    type: String,
    required: true,
  },
  // additionalDetails:{
  //   type: JSON,
  //   required: true,
  //   default: {}
  // },
  status: {
    type: String,
    required: true,
    default: 'available',
    enum: [
      'available',
      'allocated',
      'maintenance'
    ]
  }
})

module.exports.OnDemandDevice = mongoose.model.OnDemandDevice || mongoose.model('OnDemandDevice',OnDemandDeviceSchema);