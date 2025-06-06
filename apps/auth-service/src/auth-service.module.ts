import { Module } from '@nestjs/common';
import { AuthenticateController } from './auth/authenticate.controller';
import { AuthenticateService } from './auth/authenticate.service';
import { UsersController } from './users/register-user.controller';
import { RegisterUsersService } from './users/register-user.service';
import { PrismaUsersRepository } from '../repositories/prisma-users-repository';
import { UsersRepository } from '../interfaces/users-repository';
import { PrismaModule } from 'libs/prisma/src';
import { JwtAuthModule } from '../../../libs/security/jwt.module';
import { EnvModule } from 'env/env.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AuthMetricsService } from './metrics/auth-metrics.service';

@Module({
  imports: [
    PrismaModule,
    EnvModule,
    JwtAuthModule,
    PrometheusModule.register(),
  ],
  controllers: [AuthenticateController, UsersController],
  providers: [
    AuthenticateService,
    RegisterUsersService,
    AuthMetricsService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
})
export class AuthServiceModule {}
