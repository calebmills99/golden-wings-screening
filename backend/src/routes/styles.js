import { Router } from 'express';
import { stylesController } from '../controllers/stylesController.js';

export const stylesRouter = Router();

stylesRouter.get('/', stylesController.list);
stylesRouter.get('/:variant', stylesController.get);
stylesRouter.post('/', stylesController.upsert);
stylesRouter.put('/:variant', (req, res, next) => {
  req.body.variant = req.params.variant;
  return stylesController.upsert(req, res, next);
});
