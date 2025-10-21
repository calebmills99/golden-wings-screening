const { error: logError } = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logError(err.message, err);
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;
  const message = status >= 500 ? 'An unexpected error occurred.' : err.message;
  res.status(status).json({ message });
}

module.exports = errorHandler;
