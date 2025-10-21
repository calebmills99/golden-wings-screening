const respond = (res, status, payload) => res.status(status).json(payload);

module.exports = respond;
