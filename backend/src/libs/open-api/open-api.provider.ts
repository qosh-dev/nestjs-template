import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NodeEnv } from 'src/config/config-validation';
import { Envs } from 'src/config/config.module';

const logger: Logger = new Logger('Open Api');

export class OpenApiProvider {
  static provide(app: NestExpressApplication) {
    const route = `${Envs.API_PREFIX}/explorer`;

    const openApiDocs = new DocumentBuilder()
      .setTitle(Envs.OPEN_API_TITLE)
      .setVersion(Envs.OPEN_API_VERSION)
      .addGlobalParameters({
        in: 'header',
        description: 'Local timezone offset',
        example: '0300',
        name: 'tz',
      })
      .build();

    const document = SwaggerModule.createDocument(app, openApiDocs);
    SwaggerModule.setup(route, app, document);

    setTimeout(() => {
      let path = `http://${Envs.HOST}:${Envs.API_PORT}/${route}`;

      if (Envs.NODE_ENV === NodeEnv.production) {
        path = `http://${Envs.HOST}/${route}`;
      }

      console.log('Open api initiali');
      logger.debug('Open api initialized at ' + path);
    });
  }
}
