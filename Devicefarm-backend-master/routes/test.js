const express = require('express');
const router = express.Router();
const tests = require('../services/tests');

router.get('/', tests.getTests);
router.post('/', tests.createTest);
router.post('/:id/updateStatus', tests.updateStatus);

module.exports = router;