const express = require('express');
const router = express.Router();
const projects = require('../services/projects')
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

router.post('/projects/:id', projects.createProject)
router.get('/projects/:id', projects.getProjects)
router.get('/project/:id', projects.getProjectInfo)
router.delete('/projects/:id', projects.deleteProject)

router.get('/admin/projects', projects.getAllProjects)
router.put('/admin/projects/:id', projects.updateProjects)
router.get('/admin/users', projects.getAllUsers)
router.put('/admin/users/:id', projects.updateUsers)

router.get('/project/:id/testers', projects.getTestersOfAProject);
router.put('/project/:id/testers', projects.updateTestersForAProject);
router.delete('/project/:id/testers', projects.deleteTestersForAProject);

router.post('/project/:id/bugs', projects.createBug)
router.get('/project/:id/bugs', projects.getBugs)

router.post('/projects/:id/createrun', upload.array('files'), projects.createRun)
router.get('/run', projects.getRunStatus)
router.get('/project/:id/tests', projects.getTestsOfAProject)
router.post('/run', projects.stopsTests)
router.post('/rundetails', projects.getTestDetails)
router.get('/project/:id/aggrTests', projects.getAggrTestResults)

module.exports = router;
