module.exports = function notFound(req, res, next) {
  if (res.headersSent) {
    return next();
  }

  return res.status(404).json({
    error: 'NotFound',
    message: `The resource at ${req.originalUrl} could not be located.`
  });
};
