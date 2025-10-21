import { Router } from 'express';
import { registrationsRouter } from './registrations.js';
import { stylesRouter } from './styles.js';

export const apiRouter = Router();

apiRouter.use('/styles', stylesRouter);
apiRouter.use('/registrations', registrationsRouter);
