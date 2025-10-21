const { z } = require('zod');
const rsvpService = require('../services/rsvpService');

const rsvpSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('A valid email is required.'),
  phone: z.string().optional(),
  specialRequests: z.string().optional(),
  source: z.string().optional()
});

async function createRsvp(req, res, next) {
  try {
    const parsed = rsvpSchema.parse(req.body);
    const record = await rsvpService.register(parsed);
    return res.status(201).json({
      message: 'RSVP captured successfully.',
      data: record
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid RSVP payload.', errors: error.flatten() });
    }

    return next(error);
  }
}

async function listRsvps(req, res, next) {
  try {
    const records = await rsvpService.list(Number(req.query.limit) || 100);
    return res.json({ data: records });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createRsvp,
  listRsvps
};
