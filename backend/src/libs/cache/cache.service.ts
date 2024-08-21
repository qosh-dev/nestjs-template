import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis';
import { Envs } from 'src/config/config.module';
import { CACHE_METADATA_KEY, CACHE_METADATA_TTL } from './cache.common';

@Injectable()
export class CacheService {
  private instance: Redis;

  constructor(private readonly c: ConfigService) {}

  onModuleInit() {
    this.instance = new Redis({
      host: Envs.REDIS_HOST,
      port: Envs.REDIS_PORT,
      password: Envs.REDIS_PASSWORD,
    });
    Reflect.defineMetadata(CACHE_METADATA_KEY, this, CacheService);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.instance.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  async set(
    key: string,
    value: string | number | Buffer,
    ttl: number = CACHE_METADATA_TTL,
  ): Promise<void> {
    await this.instance.set(key, value);
    await this.instance.expire(key, ttl);
  }

  // ---------------------------------

  async createMany<T = any>(
    namespace: string,
    objects: T[],
    identifierField: keyof T,
  ): Promise<void> {
    const pipeline = this.instance.pipeline();
    for (const object of objects) {
      const key = `${namespace}:${object[identifierField]}`;
      pipeline.lpush(key, JSON.stringify(object));
      pipeline.expire(key, CACHE_METADATA_TTL);
    }
    await pipeline.exec();
  }

  async getMany<T = any>(namespace: string): Promise<T[]> {
    const keys = await this.instance.keys(`${namespace}:*`);
    const objects: any[] = [];
    for (const key of keys) {
      const records = await this.instance.lrange(key, 0, -1);
      const parced = records.map((v) => JSON.parse(v));
      objects.push(...parced);
    }
    return objects;
  }

  async deleteOne(key: string): Promise<void> {
    await this.instance.del(key);
  }

  async drop(namespace: string): Promise<void> {
    const keys = await this.instance.keys(`${namespace}:*`);
    if (keys.length > 0) {
      await this.instance.del(keys);
    }
  }

  createCacheableKey(args: any[], context: string): string {
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

    return 'cached_' + context + '_' + keyParts.join('_');
  }
}
