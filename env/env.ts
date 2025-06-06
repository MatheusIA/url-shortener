import { z } from 'zod';

export const envSchema = z.object({
  JWT_SECRET: z.string(),
  APP_URL: z.string(),
  DATABASE_URL: z.string(),
  OBSERVABILITY_ENABLED: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
