const { Router } = require('express');
const rsvpRoutes = require('./rsvpRoutes');
const styleRoutes = require('./styleRoutes');
const themeRoutes = require('./themeRoutes');

const router = Router();

router.use('/rsvps', rsvpRoutes);
router.use('/styles', styleRoutes);
router.use('/themes', themeRoutes);

module.exports = router;
