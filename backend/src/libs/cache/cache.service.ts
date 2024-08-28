import { Injectable } from '@nestjs/common';

import Redis from 'ioredis';
import { Envs } from 'src/config/config.module';
import { CACHE_SERVICE_METADATA_KEY } from 'src/utils/utils/utils.common';

@Injectable()
export class CacheService {
  redis: Redis;

  constructor() {}

  onModuleInit() {
    this.redis = new Redis({
      host: Envs.REDIS_HOST,
      port: Envs.REDIS_PORT,
      password: Envs.REDIS_PASSWORD,
    });
    Reflect.defineMetadata(CACHE_SERVICE_METADATA_KEY, this, CacheService);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  async set(
    key: string,
    value: string | number | Buffer,
    ttl: number,
  ): Promise<void> {
    await this.redis.set(key, value);
    await this.redis.expire(key, ttl);
  }

  async allKey(): Promise<string[]> {
    return this.redis.keys('*');
  }

  // ---------------------------------

  generateCacheableKey(args: any[],context: string): string {
    let keyParts: string[] = [];

    for (const arg of args) {
      if (typeof arg === 'string' || typeof arg === 'number') {
        keyParts.push(String(arg));
      } else if (typeof arg === 'object') {
        for (const key in arg) {
          const value = arg[key];
          if (value !== undefined && value !== null) {
            keyParts.push(`${key}-${value}`);
          }
        }
      }
    }

    if (!keyParts.length) {
      throw new Error('Invalid key');
    }

    return "cached_" + context + '_' + keyParts.join('_');
  }
}
