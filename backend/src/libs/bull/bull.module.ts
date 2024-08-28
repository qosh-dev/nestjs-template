import { BullModule as BullBaseModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { Envs } from 'src/config/config.module';
import { OPERATION_PROCESS } from 'src/modules/operation/operation.processor';

@Global()
@Module({
  imports: [
    BullBaseModule.forRootAsync({
      useFactory: () => ({
        connection: {
          host: Envs.REDIS_HOST,
          port: Envs.REDIS_PORT,
          password: Envs.REDIS_PASSWORD,
        },
      }),
    }),
    BullBaseModule.registerQueue({
      name: OPERATION_PROCESS,
    }),
  ],
})
export class BullModule {}
