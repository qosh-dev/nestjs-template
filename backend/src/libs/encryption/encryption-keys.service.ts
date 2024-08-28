import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PatchEncryptionKeysDto } from 'src/modules/payment/dto/patch-encryption-keys.dto';

@Injectable()
export class EncryptionKeysService {
  private readonly logger = new Logger(EncryptionKeysService.name);

  constructor() {}

  async readSecrets() {
    const { key: keyPath, iv: ivPath } = this.filePaths();
    const statuses = await Promise.all([
      this.isFileExist(keyPath),
      this.isFileExist(ivPath),
    ]);
    const isValid = statuses.every((v) => v);
    if (!isValid) {
      throw new Error('Error keys deleted');
    }

    const key = await fs.readFile(keyPath);
    const iv = await fs.readFile(keyPath);
    return {
      key,
      iv,
    };
  }

  async editSecrets(payload: PatchEncryptionKeysDto) {
    const { key: keyPath, iv: ivPath } = this.filePaths();
    const statuses = await Promise.all([
      this.isFileExist(keyPath),
      this.isFileExist(ivPath),
    ]);
    const isValid = statuses.every((v) => v);
    if (!isValid) {
      throw new Error('Error keys deleted');
    }

    const oldKey = await fs.readFile(keyPath);
    const oldIv = await fs.readFile(keyPath);

    try {
      await fs.writeFile(keyPath, payload.key);
      await fs.writeFile(ivPath, payload.iv);
      return true
    } catch (e) {
      await fs.writeFile(keyPath, oldKey);
      await fs.writeFile(ivPath, oldIv);
      this.logger.error('Cannot edit keys', e);
      return false
    }
  }

  // ----------------------------------------------------------------------

  filePaths() {
    const keyPath = path.join(__dirname, '..', 'secrets', 'key.txt');
    const ivPath = path.join(__dirname, '..', 'secrets', 'iv.txt');
    return {
      key: keyPath,
      iv: ivPath,
    };
  }

  async isFileExist(path: string) {
    try {
      await fs.access(path, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }
}
