const express = require('express');
const router = express.Router();
const devicefarm = require('../services/devicefarm');

router.get('/getRun', devicefarm.getRun);
router.get('/getRuns', devicefarm.getRuns);
router.get('/getUploads', devicefarm.getUploads);
router.get('/getDeviceFarmProjects', devicefarm.getDeviceFarmProjects);
router.get('/getDevices', devicefarm.getDevices);
router.get('/createDevicePool', devicefarm.createDevicePool);
router.post('/createRun', devicefarm.createRun);
router.post('/createRemoteAccessSession', devicefarm.createRemoteAccessSession);
router.get('/getRemoteAccessSession', devicefarm.getRemoteAccessSession);
router.post('/stopRemoteAccessSession', devicefarm.stopRemoteAccessSession);


module.exports = router;