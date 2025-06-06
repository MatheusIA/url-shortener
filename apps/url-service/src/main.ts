import { NestFactory } from '@nestjs/core';
import { UrlServiceModule } from './url.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLoggerService } from 'libs/custom-logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    UrlServiceModule,
    new FastifyAdapter(),
    { logger: new CustomLoggerService() },
  );

  const config = new DocumentBuilder()
    .setTitle('URL Shortener Service')
    .setDescription(
      'API para encurtar, redirecionar e gerenciar as URLs encurtadas',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
