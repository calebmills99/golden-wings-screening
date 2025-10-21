const express = require('express');
const { getTheme, listThemes } = require('../controllers/themeController');

const router = express.Router();

router.get('/', getTheme);
router.get('/variants', listThemes);

module.exports = router;
