import { Controller, Get, Header } from '@nestjs/common';
import { UrlMetricsService } from './url-metrics.service';

@Controller('metrics')
export class UrlMetricsController {
  constructor(private readonly urlMetricsService: UrlMetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  async getUrlShortenerMetrics() {
    return await this.urlMetricsService.getMetrics();
  }
}
