import { Injectable } from '@nestjs/common';
import { RedisClientType, createClient } from 'redis';
import { Envs } from 'src/config/config.module';

@Injectable()
export class RedisConnector {
  private _client?: RedisClientType;

  constructor() {}

  async client(): Promise<RedisClientType> {
    if (this._client?.isOpen) {
      return this._client;
    }
    this._client = createClient({
      socket: {
        host: Envs.REDIS_HOST,
        port: Envs.REDIS_PORT,
      },
      password: Envs.REDIS_PASSWORD,
    });

    await this._client.connect();

    return this._client;
  }
}
