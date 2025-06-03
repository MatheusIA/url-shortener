import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvModule } from 'env/env.module';
import { EnvService } from 'env/env.service';
import { JwtAuthService } from './jwt.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    EnvModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        secret: envService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [JwtAuthService, JwtAuthGuard, JwtStrategy],
  exports: [JwtAuthService, JwtAuthGuard, JwtModule],
})
export class JwtAuthModule {}
