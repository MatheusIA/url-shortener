import { Injectable } from '@nestjs/common';
import { envSchema, Env } from '../env/env';

@Injectable()
export class EnvService {
  private readonly env: Env;

  constructor() {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      console.error('Invalid environment variables:', parsed.error.format());
      throw new Error('Invalid environment variables');
    }
    this.env = parsed.data;
  }

  get<T extends keyof Env>(key: T): Env[T] {
    return this.env[key]; // <-- type assertion para ajudar o TS
  }
}
