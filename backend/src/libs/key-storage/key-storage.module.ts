import { Module } from '@nestjs/common';
import { KeyStorageService } from './key-storage.service';
import { RedisConnector } from './redis/connector';

@Module({
  providers: [KeyStorageService, RedisConnector],
  exports: [KeyStorageService],
})
export class KeyStorageModule {}
