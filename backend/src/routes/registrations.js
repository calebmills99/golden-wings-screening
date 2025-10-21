import { Router } from 'express';
import { registrationsController } from '../controllers/registrationsController.js';

export const registrationsRouter = Router();

registrationsRouter.get('/', registrationsController.list);
registrationsRouter.post('/', registrationsController.create);
