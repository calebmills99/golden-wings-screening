const { Router } = require('express');
const themeController = require('../controllers/themeController');

const router = Router();

router.get('/', themeController.listThemes);
router.get('/:id', themeController.getTheme);

module.exports = router;
