import { styleService } from '../services/styleService.js';
import { stylePayloadSchema, styleVariantParamSchema } from '../validators/styleValidator.js';

const respondWithValidationError = (res, error) => {
  return res.status(400).json({
    status: 'error',
    message: 'Invalid style payload',
    issues: error.flatten(),
  });
};

export const stylesController = {
  async list(_req, res, next) {
    try {
      const styles = await styleService.listStyles();
      res.json({ status: 'success', payload: styles });
    } catch (error) {
      next(error);
    }
  },

  async get(req, res, next) {
    try {
      const parsedParams = styleVariantParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return respondWithValidationError(res, parsedParams.error);
      }

      const style = await styleService.getStyle(parsedParams.data.variant);
      res.json({ status: 'success', payload: style });
    } catch (error) {
      next(error);
    }
  },

  async upsert(req, res, next) {
    try {
      const parsedBody = stylePayloadSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return respondWithValidationError(res, parsedBody.error);
      }

      const updated = await styleService.upsertStyle(parsedBody.data);
      res.status(201).json({ status: 'success', payload: updated });
    } catch (error) {
      next(error);
    }
  }
};
