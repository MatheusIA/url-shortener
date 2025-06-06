import { Controller, Get, Header } from '@nestjs/common';
import { AuthMetricsService } from './auth-metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: AuthMetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics() {
    return await this.metricsService.getMetrics();
  }
}
