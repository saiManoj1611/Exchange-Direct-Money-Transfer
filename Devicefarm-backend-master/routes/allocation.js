const express = require('express');
const router = express.Router();
const allocations = require('../services/allocations');

router.get('/ondemand', allocations.getAllOnDemandAllocations);
router.post('/ondemand/real', allocations.createOnDemandAllocationReal);
router.post('/ondemand/emulator', allocations.createOnDemandAllocationEmulator);
router.get('/ondemand/:id', allocations.getOnDemandAllocation);
router.post('/ondemand/updateStatus/emulator', allocations.updateOnDemandAllocationStatusEmulator);
router.post('/ondemand/:id/deallocate/real', allocations.onDemandDeallocateReal);
router.post('/ondemand/:id/deallocate/emulator', allocations.onDemandDeallocateEmulator);

router.get('/prebook', allocations.getAllPreBookAllocations);
router.post('/prebook', allocations.createPreBookAllocation);
router.get('/prebook/:id', allocations.getPreBookAllocation);
router.get('/testerbillingperiods/:id', allocations.getTesterBillingPeriods);
router.get('/peojectallocationdetails/:project_id', allocations.getProjectAllocationDetails);

module.exports = router;