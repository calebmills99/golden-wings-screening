const rsvpModel = require('../models/rsvpModel');

const createRsvp = async (payload) => {
  return rsvpModel.createRsvp(payload);
};

const listRsvps = async ({ limit, offset }) => {
  const [items, total] = await Promise.all([
    rsvpModel.listRsvps({ limit, offset }),
    rsvpModel.totalRsvps(),
  ]);

  return {
    items,
    total,
  };
};

module.exports = {
  createRsvp,
  listRsvps,
};
