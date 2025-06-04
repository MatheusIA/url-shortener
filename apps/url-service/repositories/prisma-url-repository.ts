import { Injectable } from '@nestjs/common';
import { UrlRepository } from '../interfaces/url-repository';
import { Prisma, Url } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';

@Injectable()
export class PrismaUrlRepository implements UrlRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.UrlCreateInput) {
    return this.prismaService.url.create({
      data,
    });
  }

  async findUrlExists(shortUrl: string) {
    return this.prismaService.url.findUnique({
      where: {
        shortURL: shortUrl,
      },
    });
  }

  async incrementClicks(id: number) {
    await this.prismaService.url.update({
      where: { id },
      data: {
        clicks: { increment: 1 },
      },
    });
  }

  async findByShortURL(shortURL: string) {
    return this.prismaService.url.findFirst({
      where: {
        shortURL,
        deletedAt: null,
      },
    });
  }

  async listUrlsByUserId(userId: number) {
    const list = await this.prismaService.url.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        destination: true,
        shortURL: true,
        clicks: true,
      },
    });

    return list.length ? list : null;
  }
}
