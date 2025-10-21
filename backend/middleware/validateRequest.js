const validateRequest = (validator) => (req, _res, next) => {
  try {
    const result = validator(req.body);
    req.validatedBody = result;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = validateRequest;
