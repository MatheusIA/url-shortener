import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { PrismaModule } from 'libs/prisma/src';
import { EnvModule } from 'env/env.module';
import { JwtAuthModule } from 'libs/security/jwt.module';
import { UrlRepository } from '../interfaces/url-repository';
import { PrismaUrlRepository } from '../repositories/prisma-url-repository';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { env } from './../../../env/env';
import { UrlMetricsService } from './metrics/url-metrics.service';

@Module({
  imports: [
    PrismaModule,
    EnvModule,
    JwtAuthModule,
    PrometheusModule.register({
      defaultMetrics: {
        enabled: env.OBSERVABILITY_ENABLED,
      },
    }),
  ],
  controllers: [UrlController],
  providers: [
    UrlService,
    UrlMetricsService,
    {
      provide: UrlRepository,
      useClass: PrismaUrlRepository,
    },
  ],
})
export class UrlServiceModule {}
