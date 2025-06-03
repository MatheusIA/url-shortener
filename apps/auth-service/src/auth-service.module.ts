import { Module } from '@nestjs/common';
import { AuthenticateController } from './auth/authenticate.controller';
import { AuthenticateService } from './auth/authenticate.service';
import { UsersController } from './users/register-user.controller';
import { RegisterUsersService } from './users/register-user.service';
import { PrismaUsersRepository } from '../repositories/prisma-users-repository';
import { UsersRepository } from '../interfaces/users-repository';
import { PrismaModule } from 'libs/prisma/src';
import { JwtAuthService } from './security/jwt.service';
import { JwtAuthModule } from './security/jwt.module';
import { EnvModule } from 'env/env.module';

@Module({
  imports: [PrismaModule, EnvModule, JwtAuthModule],
  controllers: [AuthenticateController, UsersController],
  providers: [
    AuthenticateService,
    RegisterUsersService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
})
export class AuthServiceModule {}
