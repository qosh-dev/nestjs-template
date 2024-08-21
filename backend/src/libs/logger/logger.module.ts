import { Global, Module } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AsyncLocalStorage } from 'async_hooks';
import {
  Logger,
  LoggerErrorInterceptor,
  LoggerModule as PinoLogger
} from 'nestjs-pino';
import { pino } from 'pino';
import { AppContextModule } from '../als/app-context.module';
import { LoggerParams } from './logger.config';

export type TransportType =
  | pino.TransportTargetOptions<Record<string, any>>
  | pino.TransportPipelineOptions<Record<string, any>>;

@Global()
@Module({
  imports: [
    AppContextModule,
    PinoLogger.forRootAsync({
      imports: [AppContextModule],
      inject: [AsyncLocalStorage],
      useFactory: LoggerParams.provide
    }),
  ],
})
export class LoggerModule {
  static provide(app: NestExpressApplication) {
    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());
  }
}
