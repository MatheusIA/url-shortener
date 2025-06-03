import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { RegisterUsersService } from './register-user.service';
import { CreateUserDTO } from 'apps/auth-service/dto/register-user-DTO';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly registerUsersService: RegisterUsersService) {}

  @Post('/register')
  async register(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    const { email, name, password } = createUserDTO;
    try {
      const user = await this.registerUsersService.execute({
        email,
        name,
        password,
      });

      return user;
    } catch (error: any) {
      this.logger.error('Erro ao criar usuário: ', error);

      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Email already registered');
      }
      throw new InternalServerErrorException('Unexpected error ocurred');
      throw error;
    }
  }
}
