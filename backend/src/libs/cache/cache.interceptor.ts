import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from './cache.service';

export function CacheInterceptor(
  namespace: string,
  contextFrom: 'body' | 'query' | 'param',
) {
  @Injectable()
  class Interceptor implements NestInterceptor {
    constructor(readonly cacheService: CacheService) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const extra = request[contextFrom] as {
        [n in string]: string | number | boolean;
      };
      const key = this.cacheService.getKey(namespace, extra);

      if (Object.keys(extra).length) {
        const cachedRecord = await this.cacheService.getOne(key);
        if (cachedRecord) {
          return of(cachedRecord);
        }
      }

      return next.handle().pipe(
        tap(async (body) => {
          if (Array.isArray(body)) {
            await this.cacheService.createMany(namespace, body, 'id');
          } else {
            await this.cacheService.create(key, body);
          }
        }),
      );
    }
  }

  return Interceptor;
}
