const rsvpModel = require('../models/rsvpModel');

async function register(payload) {
  return rsvpModel.createRsvp(payload);
}

async function list(limit) {
  return rsvpModel.listRsvps(limit);
}

module.exports = {
  register,
  list
};
