import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AppContextModule } from './libs/als/app-context.module';
import { LoggerModule } from './libs/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    LoggerModule,
    AppContextModule,
    // AuthModule,
    // UserModule,
    // ArticleModule,
  ],
  // providers: [TestService],
})
export class AppModule {}
