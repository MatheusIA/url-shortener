import { Controller, Get, Header } from '@nestjs/common';
import { AuthMetricsService } from './auth-metrics.service';
import { RegisterMetricsService } from './register-metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly metricsService: AuthMetricsService,
    private readonly registerMetricsService: RegisterMetricsService,
  ) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics() {
    return await this.metricsService.getMetrics();
  }

  @Get('/register')
  @Header('Content-Type', 'text/plain')
  async getRegisterMetrics() {
    return await this.registerMetricsService.getMetrics();
  }
}
