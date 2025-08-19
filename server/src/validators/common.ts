import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().length(24, 'Invalid Mongo ObjectId'),
});
