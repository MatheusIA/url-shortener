import { Prisma, Url } from '@prisma/client';
import { ResponseListUrlsDTO } from '../dto/response-list-urls-DTO';
import { ResponseUpdateUrlDTO } from '../dto/response-update-url-DTO';
import { ResponseDeleteUrlDTO } from '../dto/response-delete-url-DTO';

export abstract class UrlRepository {
  abstract create(data: Prisma.UrlCreateInput): Promise<Url>;
  abstract findUrlExists(shortUrl: string): Promise<Url | null>;
  abstract findByShortURL(shortURL: string): Promise<Url | null>;
  abstract incrementClicks(id: number): Promise<void>;
  abstract listUrlsByUserId(
    userId: number,
  ): Promise<ResponseListUrlsDTO[] | null>;
  abstract deleteURL(
    urlId: number,
    userId: number,
  ): Promise<ResponseDeleteUrlDTO | null>;
  abstract updateURL(
    urlId: number,
    userId: number,
    destination: string,
  ): Promise<ResponseUpdateUrlDTO | null>;
}
