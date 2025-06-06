import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UrlRepository } from '../interfaces/url-repository';
import { CreateUrlDTO } from '../dto/create-url-DTO';
import { Url } from '@prisma/client';
import { generateUrlShortener } from '../../../utils/generate-url-shortner';
import { EnvService } from '../../../env/env.service';
import { ResponseDeleteUrlDTO } from '../dto/response-delete-url-DTO';
import { ResponseUpdateUrlDTO } from '../dto/response-update-url-DTO';

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);

  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly envService: EnvService,
  ) {}

  async createShortenUrl(
    createUrlDTO: CreateUrlDTO,
    userId?: string,
  ): Promise<Url> {
    try {
      const { originalUrl } = createUrlDTO;
      let urlShortener: string;
      let exists = true;

      do {
        urlShortener = generateUrlShortener();

        const existsUrlInDB =
          await this.urlRepository.findUrlExists(urlShortener);
        exists = !!existsUrlInDB;
      } while (exists);

      const url = await this.urlRepository.create({
        destination: originalUrl,
        shortURL: urlShortener,
        ...(userId && { user: { connect: { id: Number(userId) } } }),
      });

      return {
        ...url,
        shortURL: `${this.envService.get('APP_URL')}/${urlShortener}`,
      };
    } catch (error) {
      this.logger.error('Erro ao criar URL', error);
      throw new InternalServerErrorException('Erro ao criar URL');
    }
  }

  async redirect(shortURL: string): Promise<string | undefined> {
    const url = await this.urlRepository.findByShortURL(shortURL);

    if (!url) {
      throw new NotFoundException('URL não encontrada');
    }

    await this.urlRepository.incrementClicks(url.id);

    return url.destination;
  }

  async listMyUrls(userId: number) {
    const urls = await this.urlRepository.listUrlsByUserId(userId);

    const appUrl = this.envService.get('APP_URL');

    return urls?.map((url) => ({
      id: url.id,
      destination: url.destination,
      shortURL: `${appUrl}/${url.shortURL}`,
      clicks: url.clicks,
    }));
  }

  async deleteURL(
    urlId: number,
    userId: number,
  ): Promise<ResponseDeleteUrlDTO> {
    const url = await this.urlRepository.deleteURL(urlId, userId);

    if (!url) {
      throw new NotFoundException(
        'URL informada não encontrada ou usuário sem permissão para essa ação',
      );
    }

    return { message: 'URL deletada com sucesso !' };
  }

  async updateURL(
    urlId: number,
    userId: number,
    destination: string,
  ): Promise<ResponseUpdateUrlDTO> {
    const update = await this.urlRepository.updateURL(
      urlId,
      userId,
      destination,
    );

    if (!update) {
      throw new NotFoundException(
        'URL informada nã encontrada ou usuário sem permissão para essa ação',
      );
    }

    return {
      message: 'URL atualizada com sucesso !',
      destination: update.destination,
      urlShortened: `${this.envService.get('APP_URL')}/${update.urlShortened}`,
    };
  }
}
