import { z } from 'zod';

const cssVariablesSchema = z.record(z.string().min(1), z.string().min(1));

const heroLayoutSchema = z.object({
  overlayOpacity: z.number().min(0).max(1).optional(),
  showVideo: z.boolean().optional(),
});

export const stylePayloadSchema = z.object({
  variant: z.string().min(1),
  cssVariables: cssVariablesSchema.default({}),
  mobileLayout: z.object({ hero: heroLayoutSchema }).partial().default({}),
  heroCopy: z.object({
    tagline: z.string().min(1).optional(),
    supporting: z.string().min(1).optional(),
  }).partial().default({}),
});

export const styleVariantParamSchema = z.object({
  variant: z.string().min(1),
});
