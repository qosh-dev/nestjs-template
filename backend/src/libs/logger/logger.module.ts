import { Global, Module, RequestMethod } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AsyncLocalStorage } from 'async_hooks';
import { ServerResponse } from 'http';
import {
  Logger,
  LoggerErrorInterceptor,
  Params,
  LoggerModule as PinoLogger,
} from 'nestjs-pino';
import * as path from 'path';
import { pino } from 'pino';
import { NodeEnv } from 'src/config/config-validation';
import { Envs } from 'src/config/config.module';
import { IRequestContext, SystemHeaders } from '../als/app-context.common';
import { AppContextModule } from '../als/app-context.module';

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
      useFactory: async (
        als: AsyncLocalStorage<IRequestContext>,
      ): Promise<Params> => {
        let logsDirectory: string = path.join(__dirname, '..', 'logs/');
        const nodeEnv = Envs.NODE_ENV as NodeEnv;
        const transportFormatted: TransportType[] = [
          {
            target: 'pino/file',
            options: {
              destination: logsDirectory + `app.log`,
              translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
              level: 30,
              mkdir: true,
            },
          },
        ];

        if (nodeEnv === NodeEnv.development) {
          transportFormatted.push({
            target: 'pino-pretty',
            options: {
              name: 'terminal',
              colorize: true,
              singleLine: true,
            },
          });
        }

        return {
          exclude: [{ path: '/favicon.ico', method: RequestMethod.GET }],
          pinoHttp: {
            enabled: true,
            redact: {
              paths: [
                'password',
                'reqBody.password',
                'user.password',
                'reqBody.user.password',
              ],
            },
            hooks: {
              logMethod(_inputArgs, method, level) {
                let inputArgs = _inputArgs as any;
                const context = (inputArgs[0] as any).context;
                const exceptedContexts = ['RouterExplorer', 'RoutesResolver'];
                if (exceptedContexts.includes(context)) return;
                const logData = inputArgs[0] as any as any;
                const res = logData?.res as ServerResponse;
                const req = res?.req as any as Request;

                req?.body && (inputArgs[0]['x-req'] = { body: req?.body });

                if (res && req) {
                  const isNotOk = res.statusCode < 200 && res.statusCode >= 300;

                  if (isNotOk) {
                    let resError = logData.err || {};
                    inputArgs[0] = {
                      ...inputArgs[0],
                      res: res,
                      err: resError,
                      responseTime: logData.responseTime,
                    };
                  }
                }
                return method.apply(this, inputArgs);
              },
            },
            transport: {
              targets: transportFormatted,
              level: 'debug',
            },
            mixin() {
              const store = als.getStore();
              return {
                [SystemHeaders.xRequestId]: store?.[SystemHeaders.xRequestId],
                [SystemHeaders.employeeId]: store?.[SystemHeaders.employeeId],
              };
            },
            customProps: function () {
              const store = als.getStore();
              return {
                [SystemHeaders.xRequestId]: store?.[SystemHeaders.xRequestId],
                [SystemHeaders.employeeId]: store?.[SystemHeaders.employeeId],
              };
            },
          },
        };
      },
    }),
  ],
})
export class LoggerModule {
  static provide(app: NestExpressApplication) {
    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());
  }
}
