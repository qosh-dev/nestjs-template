import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Envs } from 'src/config/config.module';

const logger: Logger = new Logger('Open Api');

export class OpenApiProvider {
  static provide(app: NestExpressApplication) {
    const PATH = `${Envs.API_PREFIX}/explorer`;

    const openApiDocs = new DocumentBuilder()
      .setTitle(Envs.OPEN_API_TITLE)
      .setVersion(Envs.OPEN_API_VERSION)
      // .addBearerAuth(
      //   {
      //     type: 'http',
      //     scheme: 'bearer',
      //     bearerFormat: 'JWT',
      //     name: 'JWT',
      //     description: 'Enter JWT token',
      //     in: 'header',
      //   },
      //   'JWT-auth',
      // )
      .addGlobalParameters({
        in: 'header',
        description: 'Local timezone offset',
        example: '0300',
        name: 'tz',
      })
      .build();

    const document = SwaggerModule.createDocument(app, openApiDocs);
    SwaggerModule.setup(PATH, app, document);

    setTimeout(() => {
      let message = `http://${Envs.HOST}:${Envs.API_PORT}/${PATH}`;

      if (process.env.NODE_ENV === 'production') {
        message = `https://${Envs.HOST}/${PATH}`;
      }

      logger.debug('Open api initialized at ' + message);
    });
  }
}
