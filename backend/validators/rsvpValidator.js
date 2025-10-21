const { z } = require('zod');

const rsvpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('A valid email is required'),
  phone: z.string().max(40).optional().or(z.literal('').transform(() => null)),
  specialRequests: z.string().max(500).optional().or(z.literal('').transform(() => null)),
  source: z.string().max(80).optional().default('web'),
});

const validateRsvp = (payload) => rsvpSchema.parse(payload);

module.exports = {
  rsvpSchema,
  validateRsvp,
};
