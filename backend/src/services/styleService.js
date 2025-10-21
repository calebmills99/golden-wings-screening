const styleModel = require('../models/styleProfileModel');

async function getActive() {
  return styleModel.getActiveStyle();
}

async function list() {
  return styleModel.listStyles();
}

async function upsert(payload) {
  const record = await styleModel.createStyle(payload);
  if (payload.isActive) {
    await styleModel.setActiveStyle(record.styleToken);
    return styleModel.getActiveStyle();
  }
  return record;
}

async function setActive(styleToken) {
  return styleModel.setActiveStyle(styleToken);
}

module.exports = {
  getActive,
  list,
  upsert,
  setActive
};
