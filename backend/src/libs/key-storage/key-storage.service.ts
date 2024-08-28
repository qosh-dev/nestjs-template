import { Injectable } from '@nestjs/common';
import { RedisConnector } from './redis/connector';

const DEFAULT_TTL = 72 * 60 * 60;

@Injectable()
export class KeyStorageService {
  constructor(private readonly connector: RedisConnector) {}
  async expire(name: string, after: number): Promise<boolean> {
    const redis = await this.connector.client();
    return redis.expire(name, after);
  }

  async get(name: string): Promise<string | null> {
    const redis = await this.connector.client();
    return redis.get(name);
  }

  async keys(pattern: string): Promise<string[]> {
    const cli = await this.connector.client();
    return cli.keys(pattern);
  }

  async getHashAll(name: string): Promise<{ [p: string]: string }> {
    const redis = await this.connector.client();
    return redis.hGetAll(name);
  }

  async getHash(name: string, field: string): Promise<string | null> {
    const redis = await this.connector.client();
    const value = await redis.hGet(name, field);
    return value ?? null;
  }

  async delHash(name: string, field: string): Promise<boolean> {
    const redis = await this.connector.client();
    const number = await redis.hDel(name, field);
    return number > 0;
  }

  async hashLength(name: string): Promise<number> {
    const redis = await this.connector.client();
    return redis.hLen(name);
  }

  async set(name: string, value: string, expiredAfter?: number): Promise<void> {
    const redis = await this.connector.client();
    await redis.set(name, value);
    expiredAfter = expiredAfter ?? DEFAULT_TTL;
    await redis.expire(name, expiredAfter);
  }
  async setNX(
    name: string,
    value: string,
    expiredAfter?: number,
  ): Promise<boolean> {
    const redis = await this.connector.client();
    const result = await redis.setNX(name, value);
    if (result) {
      expiredAfter = expiredAfter ?? DEFAULT_TTL;
      await redis.expire(name, expiredAfter);
      return true;
    }
    return false;
  }

  async setHash(name: string, field: string, value: string): Promise<void> {
    const redis = await this.connector.client();
    await redis.hSet(name, field, value);
  }

  async delete(name: string): Promise<void> {
    const redis = await this.connector.client();
    await redis.del(name);
  }

  async exists(name: string): Promise<boolean> {
    const redis = await this.connector.client();
    return (await redis.exists(name)) === 1;
  }

  async increment(name: string, expire?: number): Promise<number> {
    const redis = await this.connector.client();
    if (expire) {
      const result = await redis.multi().incr(name).expire(name, expire).exec();
      const incrResult = result[0];
      if (typeof incrResult === 'string') {
        return parseInt(incrResult);
      }
      return 0;
    }
    return redis.incr(name);
  }

  async setHashTable(key: string, data: Record<string, any>) {
    const redis = await this.connector.client();
    const fields = Object.keys(data);
    for (const field of fields) {
      await redis.hSet(key, field, data[field]);
    }
  }

  async ttl(name: string): Promise<number> {
    const redis = await this.connector.client();
    return redis.ttl(name);
  }
}
