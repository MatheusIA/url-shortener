import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Param,
  NotFoundException,
  UseGuards,
  Delete,
  Patch,
  Req,
  Redirect,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDTO } from '../dto/create-url-DTO';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
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
import { ResponseUpdateUrlDTO } from '../dto/response-update-url-DTO';
import { UrlMetricsService } from './metrics/url-metrics.service';

@Controller()
export class UrlController {
  private readonly logger = new Logger(UrlController.name);
  constructor(
    private readonly urlService: UrlService,
    private readonly jwtService: JwtService,
    private readonly urlMetricsService: UrlMetricsService,
  ) {}

  @Post('url/shorten')
  @ApiOperation({ summary: 'Rota para criar uma URL encurtada' })
  @ApiBody({ type: CreateUrlDTO })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'URL encurtada criada com sucesso' })
  async create(
    @Body() createUrl: CreateUrlDTO,
    @Req() req: FastifyRequest,
  ): Promise<{ shortURL: string }> {
    const { originalUrl } = createUrl;
    let userId: string | undefined;

    const rawAuth =
      req.headers['authorization'] || req.headers['Authorization'];
    let authorization: string | undefined;

    if (Array.isArray(rawAuth)) {
      authorization = rawAuth[0];
    } else {
      authorization = rawAuth;
    }

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

    this.urlMetricsService.incrementUrlCount();

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
  @Redirect()
  async redirect(@Param('shortURL') shortURL: string) {
    const destination = await this.urlService.redirect(shortURL);

    if (!destination) {
      throw new NotFoundException('URL não encontrada');
    }

    console.log(`Redirecionando para: ${destination} - Short URL: ${shortURL}`);

    return { url: destination, statusCode: 302 };
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
  @ApiResponse({
    status: 200,
    description: 'URL atualizada com sucesso',
    type: ResponseUpdateUrlDTO,
  })
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
