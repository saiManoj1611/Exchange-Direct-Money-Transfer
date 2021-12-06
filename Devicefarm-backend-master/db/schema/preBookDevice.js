const mongoose = require('mongoose');

const PreBookDeviceSchema = new mongoose.Schema({
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
  arn: {
    type: String,
    required: true,
  }
})

module.exports.PreBookDevice = mongoose.model.PreBookDevice || mongoose.model('PreBookDevice',PreBookDeviceSchema);