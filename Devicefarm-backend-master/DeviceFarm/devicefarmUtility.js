require('dotenv').config();
const formidable = require('formidable');
const logger = require('tracer').colorConsole();

let {OnDemandAllocation} = require('../db/schema/onDemandAllocation');

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' })

const devicefarm = new AWS.DeviceFarm({
    apiVersion: '2015-06-23',
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION
});
console.log(process.env.REGION);

const createDevicePool = async (request, response) => {
    try {
        let arn = JSON.stringify(["arn:aws:devicefarm:us-west-2::device:AC0E9432D47E494987918B7268694947"])
        const params = {
            "description": "My-Pool",
            "name": "My-Pool",
            "projectArn": "arn:aws:devicefarm:us-west-2:915431243571:project:ede20088-7c9e-44a6-9543-6d2bf63cf46a",
            "rules": [
                {
                    "attribute": "ARN",
                    "operator": "IN",
                    "value": JSON.stringify(["arn:aws:devicefarm:us-west-2::device:AC0E9432D47E494987918B7268694947"])
                }
            ]
        }
        const projects = await devicefarm.createDevicePool(params).promise();
        return response.json(projects).status(200);
        // {
        //     "devicePool": {
        //         "arn": "arn:aws:devicefarm:us-west-2:915431243571:devicepool:ede20088-7c9e-44a6-9543-6d2bf63cf46a/c1071c1d-dacc-4b4c-a89c-4c39e48ba0bd",
        //         "name": "My-Pool",
        //         "description": "My-Pool",
        //         "type": "PRIVATE",
        //         "rules": [
        //             {
        //                 "attribute": "ARN",
        //                 "operator": "IN",
        //                 "value": "[\"arn:aws:devicefarm:us-west-2::device:AC0E9432D47E494987918B7268694947\"]"
        //             }
        //         ]
        //     }
        // }
    } catch (ex) {
        logger.error(JSON.stringify(ex));
        const message = ex.message ? ex.message : 'Error while fetching project details';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const getDevices = async (request, response) => {
    try {
        const params = {
            filters: [
                {
                    "attribute": "AVAILABILITY",
                    "operator": "EQUALS",
                    "values": ["HIGHLY_AVAILABLE"]
                }
            ]
        }
        const projects = await devicefarm.listDevices(params).promise();
        return response.json(projects).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex));
        const message = ex.message ? ex.message : 'Error while fetching project details';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const getDeviceFarmProjects = async (request, response) => {
    try {
        const params = {
        };
        const projects = await devicefarm.listProjects(params).promise();
        return response.json(projects).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex));
        const message = ex.message ? ex.message : 'Error while fetching project details';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};

const getUploads = async (request, response) => {
    try {
        // const params = {
        //     "arn": "arn:aws:devicefarm:us-west-2:915431243571:project:ede20088-7c9e-44a6-9543-6d2bf63cf46a",
        //     "type": "ANDROID_APP"
        // };
        const params = {
            "arn": "arn:aws:devicefarm:us-west-2:915431243571:project:ede20088-7c9e-44a6-9543-6d2bf63cf46a",
            "type": "APPIUM_JAVA_TESTNG_TEST_PACKAGE"
        };
        const projects = await devicefarm.listUploads(params).promise();
        return response.json(projects).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex));
        const message = ex.message ? ex.message : 'Error while fetching project details';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};
const getRuns = async (request, response) => {
    try {
        const params = {
            "arn": process.env.DEVICE_FARM_PROJECT_ARN,
        };
        const projects = await devicefarm.listRuns(params).promise();
        return response.json(projects).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex));
        const message = ex.message ? ex.message : 'Error while fetching project details';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};
const getRun = async (request, response) => {
    try {
        const params = {
            "arn": "arn:aws:devicefarm:us-west-2:915431243571:run:ede20088-7c9e-44a6-9543-6d2bf63cf46a/47db2a14-cb72-4966-9d39-ff2ef20d89b3",
        };
        const projects = await devicefarm.listRuns(params).promise();
        return response.json(projects).status(200);
    } catch (ex) {
        logger.error(JSON.stringify(ex));
        const message = ex.message ? ex.message : 'Error while fetching project details';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
};


const createRun = async (req,res) => {
  new formidable.IncomingForm().parse(req,async (err,fields,files) =>{
    if(err){
      return res.json({
        success: false,
        error: err
      });
    }
    const allocation = await OnDemandAllocation.findById(fields.allocation).populate('device');

    const runname=fields.testName;
    const appFileName=files.file.name
    const appFileType=fields.appFileType
    const devicePoolName=fields.testName
    const devicePoolARNs= JSON.stringify([allocation.device.arn]);
    const testType=fields.testType
    const testPackageFileName='zip-with-dependencies.zip'
    const testPackageFileType=fields.testPackageFileType

    const testPackageFile='testPackageFile/zip-with-dependencies.zip'

    let PROJECT_ARN = process.env.DEVICE_FARM_PROJECT_ARN;

    // create the upload and upload files to the project
    let app_upload_params = {
        name: appFileName,
        type: appFileType,
        projectArn: PROJECT_ARN
    };
    let APP_UPLOAD = await devicefarm.createUpload(app_upload_params).promise().then(
        function(data){
            return data.upload;
        },
        function(error){
            console.log("Creating upload failed with error: ", error);
            res.status(400).json("Creating upload failed with error: ", error)
        }
    );

    let APP_UPLOAD_ARN = APP_UPLOAD.arn;
    let APP_UPLOAD_URL = APP_UPLOAD.url;
    console.log("app upload created with arn: ", APP_UPLOAD_ARN);
    console.log("uploading app file...");

    let options = {
        method: 'PUT',
        url: APP_UPLOAD_URL,
        headers: {},
        body: fs.readFileSync(req.file.path)
    };

    // wait for upload to finish
    await new Promise(function(resolve,reject){
        Request(options, function (error, response, body) {
            if (error) {
                console.log("uploading app file failed with error: ", error);
                res.status(400).json('uploading app file failed with error: '+error)
                reject(error);
            }
            resolve(body);
        });
    });

    //get the status of the app upload and make sure if finished processing before scheduling
    let APP_UPLOAD_STATUS = await getUploadStatus(APP_UPLOAD_ARN);
    console.log("app upload status is: ", APP_UPLOAD_STATUS);
    while(APP_UPLOAD_STATUS !== "SUCCEEDED"){
        await sleep(5000);
        APP_UPLOAD_STATUS = await getUploadStatus(APP_UPLOAD_ARN);
        console.log("app upload status is: ", APP_UPLOAD_STATUS);
    }

    //to delete application file stored in ./applicationFile directory
    await unlinkAsync(req.file.path)
    
    let devicePoolRules=[
        {
            "attribute": "ARN", 
            "operator": "IN",
            "value":devicePoolARNs
        }
    ]

    //create device pool
    let device_pool_params = {
        projectArn: PROJECT_ARN,
        name: devicePoolName,
        rules: devicePoolRules
    }

    let DEVICE_POOL_ARN = await devicefarm.createDevicePool(device_pool_params).promise().then(
        function(data){
            return data.devicePool.arn; 
        },function(error){
            console.log("device pool failed to create with error: ",error);
            res.status(400).json("device pool failed to create with error: ",error)
        }
    ); 
    console.log("Device pool created successfully with arn: ", DEVICE_POOL_ARN);

    let TEST_PACKAGE_UPLOAD_ARN=''
    if(testType!=='BUILTIN_FUZZ' && testType!=='BUILTIN_EXPLORER')
    {
            // create the upload and upload files to the project
        let testPackage_upload_params = {
            name: testPackageFileName,
            type: testPackageFileType,
            projectArn: PROJECT_ARN
        };
        let TEST_PACKAGE_UPLOAD = await devicefarm.createUpload(testPackage_upload_params).promise().then(
            function(data){
                return data.upload;
            },
            function(error){
                console.error("Creating upload failed with error: ", error);
                res.status(400).json("Creating upload failed with error: ", error)
            }
        );

        TEST_PACKAGE_UPLOAD_ARN = TEST_PACKAGE_UPLOAD.arn;
        let TEST_PACKAGE_UPLOAD_URL = TEST_PACKAGE_UPLOAD.url;
        console.log("test package upload created with arn: ", TEST_PACKAGE_UPLOAD_ARN);
        console.log("uploading test package file...");

        let options = {
            method: 'PUT',
            url: TEST_PACKAGE_UPLOAD_URL,
            headers: {},
            body: fs.readFileSync(testPackageFile)
        };

        // wait for upload to finish
        await new Promise(function(resolve,reject){
            Request(options, function (error, response, body) {
                if (error) {
                    console.error("uploading test package zip failed with error: ", error);
                    res.status(400).json("uploading test package zip failed with error: ", error)
                    reject(error);
                }
                resolve(body);
            });
        });

        //get the status of the app upload and make sure if finished processing before scheduling
        let TEST_PACKAGE_UPLOAD_STATUS = await getUploadStatus(TEST_PACKAGE_UPLOAD_ARN);
        console.log("test package upload status is: ", TEST_PACKAGE_UPLOAD_STATUS);
        while(TEST_PACKAGE_UPLOAD_STATUS !== "SUCCEEDED"){
            await sleep(5000);
            TEST_PACKAGE_UPLOAD_STATUS = await getUploadStatus(TEST_PACKAGE_UPLOAD_ARN);
            console.log("test package upload status is: ", TEST_PACKAGE_UPLOAD_STATUS);
        }
    }

    //schedule the run
    let schedule_run_params = {
        name: runname, 
        devicePoolArn: DEVICE_POOL_ARN, // You can get the Amazon Resource Name (ARN) of the device pool by using the list-pools CLI command.
        projectArn: PROJECT_ARN, // You can get the Amazon Resource Name (ARN) of the project by using the list-projects CLI command.
        test: {
        type: testType
        },
        appArn: APP_UPLOAD_ARN
    };
    
    if(testType!=='BUILTIN_FUZZ' && testType!=='BUILTIN_EXPLORER')
    {
        schedule_run_params.test.testPackageArn=TEST_PACKAGE_UPLOAD_ARN
    }

    let schedule_run_result = await devicefarm.scheduleRun(schedule_run_params).promise().then(
        function(data){
            return data.run;
        },function(error){
            console.error("Schedule run command failed with error: ", error);
            res.status(400).json("Schedule run command failed with error: ", error)
        }
    );
    console.log("run created successfully with run object: ", schedule_run_result);

    
    
    // let arn=schedule_run_result.arn
    // let name=runname
    // let type=schedule_run_result.type
    // let platform=schedule_run_result.platform
    // let status=schedule_run_result.status
    // let result=schedule_run_result.result
    // let counters=schedule_run_result.counters
    // let totalJobs=schedule_run_result.totalJobs
    // let deviceMinutes=schedule_run_result.deviceMinutes
    // const jobs = await getSubSchemas(schedule_run_result.arn)
    // const newRun = new Run({userName,projectName,arn,name,type,platform,status,result,counters,totalJobs,deviceMinutes,jobs})

    console.log(schedule_run_result)
    // newRun.save()
    // .then(()=>{
        console.log("Inside then of newRun save")
        res.json(schedule_run_result);
    // })
    // .catch((err)=>{
    //     console.log("Inside catch of newRun save")
    //     res.status(400).json("Error in save of newRun inside createRun: "+err);
    // })
    });
}

const getRemoteAccessSession = (req, resp) => {
  var params = {
    arn: req.param('sessionArn')
  };
  devicefarm.getRemoteAccessSession(params, function(err, data) {
    if (err){
      resp.json(err); // an error occurred
    }else{
      resp.json(data);
    }
  });
}

const createRemoteAccessSession = (req, resp) => {
  var params = {
    name: "MySession", 
    configuration: {
     billingMethod: "METERED"
    }, 
    deviceArn: req.body.deviceArn,
    projectArn: process.env.DEVICE_FARM_PROJECT_ARN// You can get the project ARN by using the list-projects CLI command.
   };
   devicefarm.createRemoteAccessSession(params, function(err, data) {
    if (err){
      resp.json(err);; // an error occurred
    } 
    else{
      resp.json(data);
    };           // successful response
     /*
     data = {
      remoteAccessSession: {
      }
     }
     */
   });
}

const stopRemoteAccessSession = (req, resp) => {
  var params = {
    arn: req.body.sessionArn
  };
  devicefarm.stopRemoteAccessSession(params, function(err, data) {
    if (err){
      resp.json(err); // an error occurred
    }else{
      resp.json(data);
    }
  });
}

module.exports.getRun = getRun;
module.exports.getRuns = getRuns;
module.exports.getUploads = getUploads;
module.exports.getDeviceFarmProjects = getDeviceFarmProjects;
module.exports.getDevices = getDevices;
module.exports.createDevicePool = createDevicePool;
module.exports.createRun = createRun;
module.exports.createRemoteAccessSession = createRemoteAccessSession;
module.exports.getRemoteAccessSession = getRemoteAccessSession;
module.exports.stopRemoteAccessSession = stopRemoteAccessSession;
