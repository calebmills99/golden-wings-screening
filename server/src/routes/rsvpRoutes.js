const express = require('express');
const { createRsvp, listRsvps } = require('../controllers/rsvpController');

const router = express.Router();

router.get('/', listRsvps);
router.post('/', createRsvp);

module.exports = router;
