import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../database/database-config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return ({
          ...dataSourceOptions,
          'logging': true,
          autoLoadEntities: true,
        })
      },
    }),
  ],
})
export class DatabaseModule {}
