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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtPayload } from '../dto/types/jwt-payload.type';

@Controller()
export class UrlController {
  private readonly logger = new Logger(UrlController.name);
  constructor(
    private readonly urlService: UrlService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('url/shorten')
  @ApiOperation({ summary: 'Rota para criar uma URL encurtada' })
  @ApiBody({ type: CreateUrlDTO })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'URL encurtada criada com sucesso' })
  async create(
    @Body() createUrl: CreateUrlDTO,
    @Headers('authorization') authorization?: string,
  ): Promise<{ shortURL: string }> {
    const { originalUrl } = createUrl;
    let userId: string | undefined;

    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      try {
        const payload = this.jwtService.verify<JwtPayload>(token);

        userId = payload.sub.toString();
      } catch (error) {
        this.logger.warn('Token inválido ou expirado', error);
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
  @ApiOperation({
    summary: 'Rota para redirecionar uma URL encurtada, para a URL original',
  })
  @ApiParam({ name: 'shortURL', description: 'Código da URL encurtada' })
  @ApiResponse({ status: 302, description: 'Redireciona para a URL original' })
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
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Lista as URLs encurtadas do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de URLs' })
  async listMyUrls(@CurrentUser() user: JwtPayloadDTO) {
    const userId = Number(user.sub);
    const urls = await this.urlService.listMyUrls(userId);

    return urls;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('url/:urlId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Deleta uma URL do usuário autenticado' })
  @ApiParam({ name: 'urlId', type: String })
  @ApiResponse({ status: 200, description: 'URL deletada com sucesso' })
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
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Atualiza a URL de destino de uma URL encurtada' })
  @ApiParam({ name: 'urlId', type: String })
  @ApiBody({ type: UpdateUrlDTO })
  @ApiResponse({ status: 200, description: 'URL atualizada com sucesso' })
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
