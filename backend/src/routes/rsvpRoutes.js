const { Router } = require('express');
const rsvpController = require('../controllers/rsvpController');

const router = Router();

router.post('/', rsvpController.createRsvp);
router.get('/', rsvpController.listRsvps);

module.exports = router;
