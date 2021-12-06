const express = require('express');
const router = express.Router();
const remoteSession = require('../services/remoteSession');

const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/files')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage
})

router.post('/', remoteSession.createRemoteAccessSession);
router.get('/', remoteSession.getAllRemoteAccessSession);
router.get('/:id/stop', remoteSession.stopRemoteAccessSession);
router.get('/:id', remoteSession.getRemoteAccessSession);
router.post('/updateAll', remoteSession.updateRemoteAccessSession);
router.post('/:id/installApp', upload.array('files'), remoteSession.installToRemoteAccessSession);

module.exports = router;

