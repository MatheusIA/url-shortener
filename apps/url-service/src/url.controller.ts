import { Body, Controller, Get, Logger, Post, Headers } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDTO } from '../dto/create-url-DTO';
import { Url } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Controller('url')
export class UrlController {
  private readonly logger = new Logger(UrlController.name);
  constructor(
    private readonly urlService: UrlService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/shorten')
  async create(
    @Body() createUrl: CreateUrlDTO,
    @Headers('authorization') authorization?: string,
  ): Promise<{ shortURL: string }> {
    const { originalUrl } = createUrl;
    let userId: string | undefined;

    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      try {
        const payload = this.jwtService.verify(token);

        userId = payload.sub;
      } catch (error) {
        this.logger.warn('Token inválido ou expirado');
      }
    }

    const url = await this.urlService.execute(
      {
        originalUrl,
      },
      userId,
    );

    return {
      shortURL: url.shortURL,
    };
  }
  catch(error: any) {
    this.logger.error('Erro ao criar a nova URL: ', error);

    throw error;
  }
}
