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

    const user = await this.registerUsersService.execute({
      email,
      name,
      password,
    });

    return user;
  }
}
