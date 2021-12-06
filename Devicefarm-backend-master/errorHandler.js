const logger = require('tracer').colorConsole();

module.exports.errorHandler =  (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  logger.error(err);
  const message = err.message ? err.message : 'Error while creating project';
  const code = err.statusCode ? err.statusCode : 500;
  res.status(code)
  res.json({ error: message });
};