import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  ThrottlerModule as ThrottlerBaseModule,
  ThrottlerGuard,
} from '@nestjs/throttler';
import { Envs } from 'src/config/config.module';

@Global()
@Module({
  imports: [
    ThrottlerBaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => [
        {
          ttl: Envs.THROTTLER_TTL,
          limit: Envs.THROTTLER_LIMIT,
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ThrottlerModule {}
