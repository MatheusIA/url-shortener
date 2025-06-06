import { NestFactory } from '@nestjs/core';
import { UrlServiceModule } from './url.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    UrlServiceModule,
    new FastifyAdapter(),
  );

  const config = new DocumentBuilder()
    .setTitle('URL Shortener Service')
    .setDescription(
      'API para encurtar, redirecionar e gerenciar as URLs encurtadas',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
