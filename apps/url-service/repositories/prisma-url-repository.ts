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
}
