import 'dotenv/config';
import { Envs } from 'src/config/config.module';
import { DataSource, DataSourceOptions } from 'typeorm';

export let dataSourceOptions: DataSourceOptions = {
  host: Envs.DB_HOST,
  port: Envs.DB_PORT,
  username: Envs.DB_USER,
  password: Envs.DB_PASS,
  database: Envs.DB_NAME,
  typename: '__typename',
  type: 'postgres',
  logging: false,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
};

const dataSource = new DataSource({
  ...dataSourceOptions,
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
export default dataSource;
