const fs = require('fs');
const _ = require('lodash');
let {RemoteAccessSession} = require('./../db/schema/remoteAccessSession');
const {installToRemoteAccessSession} = require('./../DeviceFarm/devicefarmSession');

module.exports.createRemoteAccessSession = async (req, resp, next) => {
  let remoteSession = await RemoteAccessSession.createRemoteAccessSession(req.body).catch(e => next(e));
  resp.json({remoteSession});
}

module.exports.stopRemoteAccessSession = async (req, resp, next) => {
  let remoteSession = await RemoteAccessSession.stopRemoteAccessSession(req.params.id).catch(e => next(e));
  resp.json({remoteSession});
}

module.exports.getAllRemoteAccessSession = (req,resp, next) => {
  RemoteAccessSession.find(req.query).sort({createdAt: -1}).then(remoteSessions => {
    resp.json({remoteSessions});
  })
}


module.exports.getRemoteAccessSession = async (req, resp, next) => {
  let remoteSession = await RemoteAccessSession.findById(req.params.id).catch(e => next(e));
  resp.json({remoteSession});
}

module.exports.installToRemoteAccessSession = async (req, resp, next) => {
  let remoteSession = await RemoteAccessSession.findById(req.params.id).catch(e => next(e));
  let installResp = await installToRemoteAccessSession(req.files[0], remoteSession.sessionDetails.arn);
  resp.json(installResp);
}

module.exports.updateRemoteAccessSession = async (req, resp, next) => {
  let remoteSessions = await RemoteAccessSession.updateRemoteAccessSession(req.body.ids).catch(e => next(e));
  resp.json({remoteSessions});
}
