const { rsvpSchema } = require('../validation/rsvpSchema');
const rsvpModel = require('../models/rsvpModel');
const asyncHandler = require('../middleware/asyncHandler');

const createRsvp = asyncHandler(async (req, res) => {
  const payload = rsvpSchema.parse(req.body);
  const record = await rsvpModel.createRsvp(payload);
  return res.status(201).json({ data: record });
});

const listRsvps = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Math.min(parseInt(req.query.limit, 10), 100) : 25;
  const rsvps = await rsvpModel.listRsvps(limit);
  return res.json({ data: rsvps });
});

module.exports = {
  createRsvp,
  listRsvps
};
