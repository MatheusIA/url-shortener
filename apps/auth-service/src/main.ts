import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from 'utils/http-exception.filter';

async function fastify() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AuthServiceModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove dados não declarados nos DTOs
      forbidNonWhitelisted: true, // Lança erro se vier campos além dos esperados
      transform: true, // Faz transformação automática dos dados
    }),
  );

  app.enableCors();
  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(3000, '0.0.0.0');
}
fastify();
