import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { UserAlreadyExistsError } from 'apps/auth-service/src/_errors/user-already-exists-error';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const timestamp = new Date().toISOString();
    const path = request.url;

    let status: number;
    let message: string | object;
    let stack: string | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? { message: res } : res;
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = { message: exception.message || 'Internal server error' };
      stack = exception.stack;
    } else if (exception instanceof UserAlreadyExistsError) {
      status = HttpStatus.CONFLICT;
      message = { message: exception.message };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = { message: 'Internal server error' };
    }

    this.logger.error(
      `HTTP Status: ${status} Error: ${JSON.stringify(message)}`,
      stack,
    );

    response.status(status).send({
      statusCode: status,
      timestamp,
      path,
      ...message,
    });
  }
}
