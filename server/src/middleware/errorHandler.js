const { ZodError } = require('zod');
const logger = require('../utils/logger');

module.exports = function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  logger.error({ err, path: req.path }, 'Unhandled error');

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'ValidationError',
      details: err.issues
    });
  }

  if (err && err.code === '23505') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'An RSVP with this email already exists.'
    });
  }

  return res.status(500).json({
    error: 'ServerError',
    message: err.message || 'An unexpected error occurred.'
  });
};
