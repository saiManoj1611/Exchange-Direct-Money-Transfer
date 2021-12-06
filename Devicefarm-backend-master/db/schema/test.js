const mongoose = require('mongoose');
let {OnDemandDevice} = require('./onDemandDevice')

const TestSchema = new mongoose.Schema({
  testName:{
    type: String,
    required: true
  },
  testDescription:{
    type: String,
    required: true
  },
  allocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OnDemandAllocation'
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
  status:{
    type: String,
    required: true,
    default: 'running',
    enum: ['running','completed','error']
  }
},{
  timestamps: true,
});


module.exports.Test = mongoose.model.Test || mongoose.model('Test',TestSchema)