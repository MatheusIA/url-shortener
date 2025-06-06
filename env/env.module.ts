import { Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          throw new Error(
            'Environment validation error: ' +
              JSON.stringify(result.error.format(), null, 2),
          );
        }
        return result.data;
      },
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
