import { z } from 'zod';

export const envSchema = z.object({
  JWT_SECRET: z.string(),
  APP_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;
