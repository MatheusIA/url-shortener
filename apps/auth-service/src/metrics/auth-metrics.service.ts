import { Injectable } from '@nestjs/common';
import { register } from 'prom-client';
import { Counter } from 'prom-client';

@Injectable()
export class AuthMetricsService {
  private readonly loginCounter: Counter<string>;

  constructor() {
    this.loginCounter = new Counter({
      name: 'auth_login_total',
      help: 'Total de logins realizados',
    });
  }

  incrementLoginCount() {
    this.loginCounter.inc();
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
