const express = require('express');
const router = express.Router();
const userAccess = require('../services/userAccess')

router.get('/signin', userAccess.signin)
router.post('/signup', userAccess.signup)
router.get('/profile/:id', userAccess.getProfile)
router.put('/profile/:id', userAccess.updateProfile)

module.exports = router;
