import { NestFactory } from '@nestjs/core';
import { UrlServiceModule } from './url.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    UrlServiceModule,
    new FastifyAdapter(),
  );

  app.enableCors();

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
