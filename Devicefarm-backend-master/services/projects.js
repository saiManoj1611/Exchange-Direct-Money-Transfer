const logger = require('tracer').colorConsole();
const _ = require('lodash');
const createError = require('http-errors');
const tester = require('../db/schema/tester').createModel();
const manager = require('../db/schema/manager').createModel();
const project = require('../db/schema/projects').createModel();
const bug = require('../db/schema/bug').createModel();
const run = require('../db/schema/run').createModel();
const operations = require('../db/operations');
var path = require('path')
const fs = require('fs');
const requestPromise = require('request-promise');
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' })
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const devicefarm = new AWS.DeviceFarm({
    apiVersion: '2015-06-23',
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION
});

const createProject = async (request, response) => {
    try {
        const { id } = request.params;
        request.body.managerId = id;
        const resp = await operations.saveDocuments(project, request.body, { runValidators: true })
        return response.status(200).json(resp);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while creating project';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const deleteProject = async (request, response) => {
    try {
        const { id } = request.params;
        const resp = await operations.deleteDocument(project, id)
        return response.status(200).json({ "message": "success" });
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while creating project';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const getProjects = async (request, response) => {
    try {
        const { id } = request.params;
        let resp = [];
        if (request.query.persona === "manager") {
            resp = await project.find({ managerId: id, blocked: false }, { __v: 0 }).lean().populate('testers.id', { name: 1, email: 1, _id: 1 });
        }
        if (request.query.persona === "tester") {
            resp = await project.find({ 'testers.id': id, blocked: false }, { __v: 0 }).lean().populate('managerId', { name: 1, email: 1, _id: 1 }).populate('testers.id', { name: 1, email: 1, _id: 1 });
        }
        return response.status(200).json(resp);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching projects';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const getProjectInfo = async (request, response) => {
    try {
        const { id } = request.params;
        let resp = [];
        resp = await project.find({ '_id': id }, { __v: 0 }).lean().populate('managerId', { name: 1, email: 1, _id: 1 }).populate('testers.id', { name: 1, email: 1, _id: 1 });
        resp[0].bugs = await bug.countDocuments({ projectId: id })
        resp[0].tests = await run.countDocuments({ projectId: id })
        return response.status(200).json(resp[0]);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching projects';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const getTestersOfAProject = async (request, response) => {
    try {
        const { id } = request.params;
        let res = [];
        if (_.isUndefined(request.query.isFree)) {
            let resp = await project.find({ '_id': id }, { __v: 0 }).populate('testers.id', { name: 1, email: 1, _id: 1 });
            resp[0]['testers'].map(tester => { res.push(tester.id) })
        }
        if (!_.isUndefined(request.query.list)) {
            let resp = await project.find({ '_id': id }, { __v: 0 }).populate('testers.id', { name: 1, email: 1, _id: 1 });
            res = resp[0]['testers']
        }
        if (!_.isUndefined(request.query.isFree)) {
            let resp = await project.find({ '_id': id }, { __v: 0 }).populate('testers.id', { name: 1, email: 1, _id: 1 });
            let ids = [];
            resp[0]['testers'].map(tester => { ids.push(tester.id._id) })
            res = await tester.find({ '_id': { '$nin': ids }, blocked: false }, { __v: 0, password: 0 })
        }
        return response.status(200).json(res);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching projects';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const updateTestersForAProject = async (request, response) => {
    try {
        const { id } = request.params;
        let testerData = [];
        const testers = await operations.findDocumentsByQuery(project, { _id: id }, { testers: 1 })
        request.body.map(id => { testerData.push({ id }) })
        testerData = testerData.concat(testers[0]['testers'])
        await operations.updateField(project, id, { testers: testerData })
        return response.status(200).json(testerData);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while creating project';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const deleteTestersForAProject = async (request, response) => {
    try {
        const { id } = request.params;
        let testerData = [];
        const testers = await operations.findDocumentsByQuery(project, { _id: id }, { testers: 1 })
        testers[0]['testers'].map(tester => {
            if (!_.isEqual(tester.id.toString(), request.query.id.toString())) testerData.push({ id: tester.id })
        })
        await operations.updateField(project, id, { testers: testerData })
        return response.status(200).json(testerData);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while creating project';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const getAllProjects = async (request, response) => {
    try {
        let resp = await project.find({}, { __v: 0 }).lean().populate('testers.id', { name: 1, email: 1, _id: 1 }).populate('managerId', { name: 1, email: 1, _id: 1 });
        return response.status(200).json(resp);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching projects';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const updateProjects = async (request, response) => {
    try {
        let resp = await operations.updateField(project, request.params.id, { blocked: request.body.blocked })
        return response.status(200).json(resp);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while updating projects';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const getAllUsers = async (request, response) => {
    try {
        let resp = await tester.find({}, { __v: 0, password: 0 }).lean()
        return response.status(200).json(resp);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching users';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const updateUsers = async (request, response) => {
    try {
        let resp = await operations.updateField(tester, request.params.id, { blocked: request.body.blocked })
        return response.status(200).json(resp);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while updating projects';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const createBug = async (request, response) => {
    try {
        const resp = await operations.saveDocuments(bug, request.body, { runValidators: true })
        return response.status(200).json(resp);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while creating bug';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const getBugs = async (request, response) => {
    try {
        const { id } = request.params;
        resp = await bug.find({ projectId: id }, { __v: 0 }).lean().populate('testerId', { name: 1, _id: 1 });
        return response.status(200).json(resp);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching bugs';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const createRun = async (request, response) => {
    try {
        let appFile = "";
        let testFile = "";
        request.body.selectedDevices = JSON.parse(JSON.stringify(JSON.parse(request.body.selectedDevices)));
        for (let file of request.files) {
            if (path.extname(file.originalname) === ".apk" || path.extname(file.originalname) === ".ipa") appFile = file.originalname
            else testFile = file.originalname
        }

        //Create Project
        const projectDetails = await devicefarm.createProject({ name: request.body.projectName, defaultJobTimeoutMinutes: 30 }).promise();
        logger.debug("Project ARN :: " + projectDetails.project.arn)

        // Create Device Pool
        let poolDevices = []
        for (device of request.body.selectedDevices) {
            poolDevices.push(device.arn)
        }
        const poolParams = {
            "description": request.body.devicepool,
            "name": request.body.devicepool,
            "projectArn": projectDetails.project.arn,
            "rules": [
                {
                    "attribute": "ARN",
                    "operator": "IN",
                    "value": JSON.stringify(poolDevices)
                }
            ]
        }
        const devicePoolDetails = await devicefarm.createDevicePool(poolParams).promise();
        logger.debug("Device Pool ARN :: " + devicePoolDetails.devicePool.arn)

        // Create Application File upload
        let applicationParams = {
            name: appFile,
            type: request.body.appFileType,
            projectArn: projectDetails.project.arn
        };
        let applicationFile = await devicefarm.createUpload(applicationParams).promise()
        logger.debug(applicationFile)
        let options = {
            method: 'PUT',
            url: applicationFile.upload.url,
            headers: {},
            body: fs.readFileSync('./public/files/' + appFile)
        };
        await requestPromise(options)
        let applicationFileUploadStatus = applicationFile.upload.status
        while (applicationFileUploadStatus !== "SUCCEEDED") {
            await sleep(3000);
            applicationFileUploadStatus = (await devicefarm.getUpload({ arn: applicationFile.upload.arn }).promise()).upload.status;
            logger.debug("Application File Upload Status :: ", applicationFileUploadStatus);
        }
        fs.unlink('./public/files/' + appFile, () => { })
        logger.debug("Application File ARN :: " + applicationFile.upload.arn)

        // Create Test File upload
        let testFileARN = "";
        if (request.body.testType !== 'BUILTIN_FUZZ' && request.body.testType !== 'BUILTIN_EXPLORER') {
            let testParams = {
                name: testFile,
                type: request.body.testPackageFileType,
                projectArn: projectDetails.project.arn
            };
            let testFileUploadData = await devicefarm.createUpload(testParams).promise()
            logger.debug(testFileUploadData)
            let testOptions = {
                method: 'PUT',
                url: testFileUploadData.upload.url,
                headers: {},
                body: fs.readFileSync('./public/files/' + testFile)
            };
            testFileARN = testFileUploadData.upload.arn;
            await requestPromise(testOptions)
            let testFileUploadStatus = testFileUploadData.upload.status
            while (testFileUploadStatus !== "SUCCEEDED") {
                await sleep(3000);
                testFileUploadStatus = (await devicefarm.getUpload({ arn: testFileUploadData.upload.arn }).promise()).upload.status;
                console.log("Test File Upload Status :: ", testFileUploadStatus);
            }
            fs.unlink('./public/files/' + testFile, () => { })
            logger.debug("Test File ARN :: " + testFileUploadData.upload.arn)
        }

        // Schedule the run
        let runParams = {
            name: request.body.runName,
            executionConfiguration: {
                jobTimeoutMinutes: 20
            },
            devicePoolArn: devicePoolDetails.devicePool.arn,
            projectArn: projectDetails.project.arn,
            test: {
                type: request.body.testType
            },
            appArn: applicationFile.upload.arn
        };

        if (request.body.testType !== 'BUILTIN_FUZZ' && request.body.testType !== 'BUILTIN_EXPLORER') {
            runParams.test.testPackageArn = testFileARN
        }
        logger.debug("Run Params :: " + JSON.stringify(runParams))
        let runResponse = await devicefarm.scheduleRun(runParams).promise()
        logger.debug("Create Run Response :: " + JSON.stringify(runResponse))
        request.body.arn = runResponse.run.arn;
        request.body.status = runResponse.run.status;
        request.body.result = runResponse.run.result;
        request.body.created = runResponse.run.created;
        request.body.started = runResponse.run.started;
        request.body.triggeredAt = new Date().toISOString();
        request.body.deviceMinutes = {};
        const resp = await operations.saveDocuments(run, request.body, { runValidators: true })
        return response.status(200).json({});
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while creating run';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const getRunStatus = async (request, response) => {
    try {
        let schedule_run_result = await devicefarm.listArtifacts({ arn: "arn:aws:devicefarm:us-west-2:915431243571:run:d4d95e50-00a3-403b-b737-2bdd3e6782f2/904eb0e1-aca9-4040-955f-779b1c83dac5", type: "FILE" }).promise()
        //let schedule_run_result = await devicefarm.listProjects({}).promise()
        console.log(schedule_run_result)
        return response.status(200).json(schedule_run_result);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching bugs';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const updateStatuses = async (id) => {
    let tests = await run.find({ 'projectId': id, 'status': { $nin: ['COMPLETED'] } }, { __v: 0 });
    for (test of tests) {
        let resp = await devicefarm.getRun({ arn: test.arn }).promise();
        let data = { 'status': resp.run.status, 'result': resp.run.result }
        if (resp.run.status === "COMPLETED") {
            data.stopped = resp.run.stopped
            data.deviceMinutes = resp.run.deviceMinutes
        }
        await operations.updateField(run, test._id, data)
    }
}

const getTestsOfAProject = async (request, response) => {
    try {
        const { id } = request.params;
        await updateStatuses(id)
        let resp = [];
        let filter = { 'projectId': id };
        request.query.testerId && (filter.testerId = request.query.testerId);
        resp = await run.find(filter, { __v: 0 }).lean().populate('testerId', { name: 1, email: 1, _id: 1 });
        return response.status(200).json(resp);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while fetching tests';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
}

const stopsTests = async (request, response) => {
    try {
        const { id } = request.body;
        await devicefarm.stopRun({ arn: id }).promise();
        return response.status(200).json({ "message": "success" });
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while stopping run';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
}

const getTestDetails = async (request, response) => {
    try {
        const { id } = request.body;
        let resp = await devicefarm.getRun({ arn: id }).promise()
        resp.run.devices = (await run.find({ 'arn': id }, { selectedDevices: 1 }))[0]['selectedDevices']
        resp.screenshots = await devicefarm.listArtifacts({ arn: id, type: "SCREENSHOT" }).promise()
        resp.logs = await devicefarm.listArtifacts({ arn: id, type: "FILE" }).promise()
        return response.status(200).json(resp);
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while stopping run';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
}

const getAggrTestResults = async (request, response) => {
    try {
        let aggr = [
            { "$match": { "projectId": ObjectId(request.params.id) } },
            {
                "$group": {
                    _id: "$result",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    "name": "$_id",
                    "value": "$count"
                }
            }
        ]
        return response.status(200).json(await run.aggregate(aggr));
    } catch (ex) {
        logger.error(ex);
        const message = ex.message ? ex.message : 'Error while stopping run';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
}

module.exports.createRun = createRun;
module.exports.getRunStatus = getRunStatus;
module.exports.getTestsOfAProject = getTestsOfAProject;
module.exports.stopsTests = stopsTests;
module.exports.getTestDetails = getTestDetails;
module.exports.createBug = createBug;
module.exports.getBugs = getBugs;
module.exports.getAllProjects = getAllProjects;
module.exports.updateProjects = updateProjects;
module.exports.getAllUsers = getAllUsers;
module.exports.updateUsers = updateUsers;
module.exports.createProject = createProject;
module.exports.getProjects = getProjects;
module.exports.getProjectInfo = getProjectInfo;
module.exports.getTestersOfAProject = getTestersOfAProject;
module.exports.updateTestersForAProject = updateTestersForAProject;
module.exports.deleteTestersForAProject = deleteTestersForAProject;
module.exports.deleteProject = deleteProject;
module.exports.getAggrTestResults = getAggrTestResults;
