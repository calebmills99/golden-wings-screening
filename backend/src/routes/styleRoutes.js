const { Router } = require('express');
const styleController = require('../controllers/styleController');

const router = Router();

router.get('/active', styleController.getActiveStyle);
router.get('/', styleController.listStyles);
router.post('/', styleController.createStyle);
router.patch('/active/:styleToken', styleController.setActiveStyle);

module.exports = router;
