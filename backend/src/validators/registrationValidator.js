import { z } from 'zod';

export const registrationPayloadSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('A valid email is required'),
  phone: z.string().max(30).optional().default(''),
  specialRequests: z.string().max(500).optional().default(''),
  source: z.string().min(1).optional().default('gwingz.com'),
});

export const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(200).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
});
