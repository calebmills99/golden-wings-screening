const { Router } = require('express');

const rsvpRoutes = require('./rsvpRoutes');
const themeRoutes = require('./themeRoutes');

const router = Router();

router.use('/rsvps', rsvpRoutes);
router.use('/theme', themeRoutes);

module.exports = router;
