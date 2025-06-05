import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Headers,
  Param,
  NotFoundException,
  Res,
  UseGuards,
  Request,
  Delete,
  Patch,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDTO } from '../dto/create-url-DTO';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply } from 'fastify';
import { JwtAuthGuard } from 'libs/security/jwt-auth.guard';
import { CurrentUser } from '../decorator/current-user.decorator';
import { JwtPayloadDTO } from '../dto/jwt-payload-DTO';
import { UpdateUrlDTO } from '../dto/update-url-DTO';

@Controller()
export class UrlController {
  private readonly logger = new Logger(UrlController.name);
  constructor(
    private readonly urlService: UrlService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('url/shorten')
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

    const url = await this.urlService.createShortenUrl(
      {
        originalUrl,
      },
      userId,
    );

    return {
      shortURL: url.shortURL,
    };
  }

  @Get('/:shortURL')
  async redirect(
    @Param('shortURL') shortURL: string,
    @Res() reply: FastifyReply,
  ) {
    const destination = await this.urlService.redirect(shortURL);

    if (!destination) {
      throw new NotFoundException('URL não encontrada');
    }

    return reply.redirect(destination);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my-urls')
  async listMyUrls(@CurrentUser() user: JwtPayloadDTO) {
    const userId = Number(user.sub);
    const urls = await this.urlService.listMyUrls(userId);

    return urls;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('url/:urlId')
  async deleteURL(
    @Param('urlId') id: string,
    @CurrentUser() user: JwtPayloadDTO,
  ) {
    const userId = Number(user.sub);

    const url_deleted = await this.urlService.deleteURL(Number(id), userId);

    return url_deleted;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('url/:urlId')
  async updateUrl(
    @Param('urlId') id: string,
    @CurrentUser() user: JwtPayloadDTO,
    @Body() body: UpdateUrlDTO,
  ) {
    const userId = Number(user.sub);

    const url_updated = await this.urlService.updateURL(
      Number(id),
      userId,
      body.destination,
    );

    return url_updated;
  }
}
