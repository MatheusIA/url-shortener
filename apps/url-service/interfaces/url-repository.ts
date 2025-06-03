import { Prisma, Url } from '@prisma/client';

export abstract class UrlRepository {
  abstract create(data: Prisma.UrlCreateInput): Promise<Url>;
  abstract findUrlExists(shortUrl: string): Promise<Url | null>;
}
