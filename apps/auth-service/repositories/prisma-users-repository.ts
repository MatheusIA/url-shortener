import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../interfaces/users-repository';
import { PrismaService } from 'libs/prisma/src';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prismaService: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({ data });
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
