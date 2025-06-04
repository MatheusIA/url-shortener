import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UrlRepository } from '../interfaces/url-repository';
import { CreateUrlDTO } from '../dto/create-url-DTO';
import { Url } from '@prisma/client';
import { generateUrlShortener } from 'utils/generate-url-shortner';
import { EnvService } from 'env/env.service';
import { RedirectUrlDTO } from '../dto/redirect-url-DTO';

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
      throw new InternalServerErrorException('Erro ao criar URL');
    }
  }

  async redirect(shortURL: string): Promise<any> {
    try {
      const url = await this.urlRepository.findByShortURL(shortURL);

      if (!url) {
        throw new NotFoundException('URL não encontrada');
      }

      await this.urlRepository.incrementClicks(url.id);

      return url.destination;
    } catch (error) {}
  }

  async listMyUrls(userId: number) {
    const urls = await this.urlRepository.listUrlsByUserId(userId);

    const appUrl = this.envService.get('APP_URL');

    return urls?.map((url) => ({
      destination: url.destination,
      shortURL: `${appUrl}/${url.shortURL}`,
      clicks: url.clicks,
    }));
  }
}
