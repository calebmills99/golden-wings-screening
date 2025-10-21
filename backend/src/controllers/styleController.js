const { z } = require('zod');
const styleService = require('../services/styleService');

const styleSchema = z.object({
  styleToken: z.string().min(3),
  label: z.string().min(2),
  settings: z.record(z.any()).optional(),
  isActive: z.boolean().optional()
});

async function getActiveStyle(req, res, next) {
  try {
    const style = await styleService.getActive();
    if (!style) {
      return res.json({ styleToken: null, settings: {} });
    }
    return res.json(style);
  } catch (error) {
    return next(error);
  }
}

async function listStyles(req, res, next) {
  try {
    const styles = await styleService.list();
    return res.json({ data: styles });
  } catch (error) {
    return next(error);
  }
}

async function createStyle(req, res, next) {
  try {
    const parsed = styleSchema.parse(req.body);
    const record = await styleService.upsert(parsed);
    return res.status(201).json({ message: 'Style profile saved.', data: record });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid style payload.', errors: error.flatten() });
    }
    return next(error);
  }
}

async function setActiveStyle(req, res, next) {
  try {
    const { styleToken } = req.params;
    const record = await styleService.setActive(styleToken);
    if (!record) {
      return res.status(404).json({ message: 'Style token not found.' });
    }
    return res.json({ message: 'Active style updated.', data: record });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getActiveStyle,
  listStyles,
  createStyle,
  setActiveStyle
};
