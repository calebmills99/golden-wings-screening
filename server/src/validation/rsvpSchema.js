const { z } = require('zod');

const rsvpSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().transform((value) => value || ''),
  specialRequests: z.string().optional().transform((value) => value || ''),
  source: z.string().optional().default('unknown'),
  submittedAt: z.string().optional()
});

module.exports = {
  rsvpSchema
};
