const respond = require('../utils/respond');
const rsvpService = require('../services/rsvpService');

const create = async (req, res, next) => {
  try {
    const payload = req.validatedBody || req.body;
    const record = await rsvpService.createRsvp(payload);
    return respond(res, 201, {
      success: true,
      data: record,
    });
  } catch (error) {
    return next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10) || 50;
    const offset = Number.parseInt(req.query.offset, 10) || 0;

    const result = await rsvpService.listRsvps({ limit, offset });
    return respond(res, 200, {
      success: true,
      ...result,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  create,
  list,
};
