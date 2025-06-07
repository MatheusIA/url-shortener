import { Injectable } from '@nestjs/common';
import { Counter, register } from 'prom-client';

@Injectable()
export class RegisterMetricsService {
  private readonly registerCount: Counter<string>;

  constructor() {
    this.registerCount = new Counter({
      name: 'auth_register_total',
      help: 'Total de registros realizados',
    });
  }

  incrementRegisterCount() {
    this.registerCount.inc();
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
