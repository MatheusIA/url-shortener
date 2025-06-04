import { Prisma, Url } from '@prisma/client';
import { ResponseListUrlsDTO } from '../dto/response-list-urls-DTO';

export abstract class UrlRepository {
  abstract create(data: Prisma.UrlCreateInput): Promise<Url>;
  abstract findUrlExists(shortUrl: string): Promise<Url | null>;
  abstract findByShortURL(shortURL: string): Promise<Url | null>;
  abstract incrementClicks(id: number): Promise<void>;
  abstract listUrlsByUserId(
    userId: number,
  ): Promise<ResponseListUrlsDTO[] | null>;
}
