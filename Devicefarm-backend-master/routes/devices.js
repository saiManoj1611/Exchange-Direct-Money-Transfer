const express = require('express');
const router = express.Router();
const devices = require('../services/devices');

router.get('/ondemand', devices.getAvailableOnDemandDevices);
router.post('/ondemand', devices.createOnDemandDevice);
router.get('/prebook', devices.getAvailablePreBookDevices);
router.post('/prebook', devices.createPreBookDevice);
router.post('/project/:id/devices', devices.createPreBookDevice);
router.get('/project/:id/devices', devices.getAvailablePreBookDevices);
router.post('/project/:id/emulators', devices.createPreBookEmulator);
router.get('/project/:id/emulators', devices.getAvailablePreBookEmulators);

module.exports = router;