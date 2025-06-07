import { Injectable } from '@nestjs/common';
import { Counter, register } from 'prom-client';

@Injectable()
export class UrlMetricsService {
  private readonly urlCounter: Counter<string>;

  constructor() {
    this.urlCounter = new Counter({
      name: 'url_shortened_total',
      help: 'Total de URLs encurtados',
      registers: [register],
    });
  }

  incrementUrlCount() {
    this.urlCounter.inc();
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
