import { Logger } from '@nestjs/common';
import {
  CACHE_SERVICE_METADATA_KEY,
  CURRENCY_RATE_TTL,
} from 'src/utils/utils/utils.common';
import { CacheService } from './cache.service';

export const Cacheable = (options?: { ttlS?: number }): MethodDecorator => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const logger = new Logger(propertyKey);

    descriptor.value = async (...args: any[]) => {
      const cacheService: CacheService = Reflect.getMetadata(
        CACHE_SERVICE_METADATA_KEY,
        CacheService,
      );
      target.cacheService = cacheService;
      target.logger = logger
      
      const _key = cacheService.generateCacheableKey(args, propertyKey);
      const ttl = options?.ttlS || CURRENCY_RATE_TTL;
      const cachedValue = await cacheService.get(_key);

      if (cachedValue) return cachedValue;
      const result = await originalMethod.apply(target, args);
      await cacheService.set(_key, result, ttl);
      return result;
    };

    return descriptor;
  };
};
