import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PatchEncryptionKeysDto } from 'src/modules/payment/dto/patch-encryption-keys.dto';
import { EncryptionKeysService } from './encryption-keys.service';

@Injectable()
export class EncryptionService {
  constructor(private readonly keysService: EncryptionKeysService) {}

  async onModuleInit() {
    await this.validateKeys();
  }

  // ----------------------------------------------------------------------------

  async encrypt(data: string) {
    const { key, iv, method } = await this.getSecrets();
    const cipher = crypto.createCipheriv(method, key, iv);
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex'),
    ).toString('base64');
  }

  async decrypt(encryptedData: string) {
    const { key, iv, method } = await this.getSecrets();
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = crypto.createDecipheriv(method, key, iv);

    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    );
  }

  // ----------------------------------------------------------------------------

  async editSecrets(payload: PatchEncryptionKeysDto) {
    return this.keysService.editSecrets(payload);
  }

  private async getSecrets() {
    const { key: keyStr, iv: ivStr } = await this.keysService.readSecrets();
    const ecnryption_method = 'aes-256-cbc';

    const encryptionKey = crypto
      .createHash('sha512')
      .update(keyStr)
      .digest('hex')
      .substring(0, 32);

    const encryptionIV = crypto
      .createHash('sha512')
      .update(ivStr)
      .digest('hex')
      .substring(0, 16);

    return {
      key: encryptionKey,
      iv: encryptionIV,
      method: ecnryption_method,
    };
  }

  // ----------------------------------------------------------------------------

  private async validateKeys() {
    const { key: keyPath, iv: ivPath } = this.keysService.filePaths();

    const secrets = await Promise.all([
      this.keysService.isFileExist(keyPath),
      this.keysService.isFileExist(ivPath),
    ]);
    const isValid = secrets.every((v) => v);
    if (!isValid) {
      throw new Error('Keys not specified.');
    }
  }
}
