import { Global, Module } from '@nestjs/common';
import { EncryptionKeysService } from './encryption-keys.service';
import { EncryptionService } from './encryption.service';

@Global()
@Module({
  providers: [EncryptionService,EncryptionKeysService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
