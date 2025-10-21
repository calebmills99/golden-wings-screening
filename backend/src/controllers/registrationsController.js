import { registrationService } from '../services/registrationService.js';
import { paginationSchema, registrationPayloadSchema } from '../validators/registrationValidator.js';

const respondWithValidationError = (res, error) => {
  return res.status(400).json({
    status: 'error',
    message: 'Invalid registration payload',
    issues: error.flatten(),
  });
};

export const registrationsController = {
  async list(req, res, next) {
    try {
      const parsedQuery = paginationSchema.safeParse(req.query);
      if (!parsedQuery.success) {
        return respondWithValidationError(res, parsedQuery.error);
      }

      const registrations = await registrationService.listRegistrations(parsedQuery.data);
      res.json({ status: 'success', payload: registrations });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const parsedBody = registrationPayloadSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return respondWithValidationError(res, parsedBody.error);
      }

      const created = await registrationService.createRegistration(parsedBody.data);
      res.status(201).json({ status: 'success', payload: created });
    } catch (error) {
      next(error);
    }
  }
};
