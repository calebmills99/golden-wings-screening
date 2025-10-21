const { Router } = require('express');

const rsvpController = require('../controllers/rsvpController');
const validateRequest = require('../middleware/validateRequest');
const { validateRsvp } = require('../validators/rsvpValidator');

const router = Router();

router.get('/', rsvpController.list);
router.post('/', validateRequest(validateRsvp), rsvpController.create);

module.exports = router;
