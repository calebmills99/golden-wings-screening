const { ZodError } = require('zod');

const respond = require('../utils/respond');

const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return respond(res, 400, {
      success: false,
      message: 'Validation failed',
      issues: error.errors.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  const status = error.status || 500;
  const payload = {
    success: false,
    message: status === 500 ? 'Internal server error' : error.message,
  };

  if (status === 500) {
    console.error('Golden Wings backend error', error);
  }

  return respond(res, status, payload);
};

module.exports = errorHandler;
