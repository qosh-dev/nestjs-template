import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export enum NodeEnv {
  test = 'test',
  development = 'development',
  production = 'production',
}

export class EnvironmentVariables {
  @IsNotEmpty()
  @IsEnum(NodeEnv)
  @IsString()
  NODE_ENV: NodeEnv = null;

  // ---------------------------------------------------------------

  @IsNotEmpty()
  @IsString({ each: true })
  @Transform((t) => {
    if (t.value === '*') {
      return '*';
    }

    const splitted = t.value.split(',').map((v) => v.trim());
    if (splitted.length === 1) {
      return [t.value.trim()];
    } else {
      return splitted;
    }
  })
  API_CORS_ORIGIN: string[] = [];

  @IsNotEmpty()
  @IsString()
  APP_PREFIX: string = null;

  @IsNotEmpty()
  @IsNumberString()
  PORT: string = null;

  @IsNotEmpty()
  @IsString()
  HOST: string = null;

  // ---------------------------------------------------------------

  @IsString()
  OPEN_API_TITLE: string = null;

  @IsString()
  OPEN_API_VERSION: string = null;

  // ---------------------------------------------------------------

  @IsNotEmpty()
  @IsString()
  DB_HOST: string = null;

  @IsNotEmpty()
  @IsNumber()
  DB_PORT: number = null;

  @IsNotEmpty()
  @IsString()
  DB_USER: string = null;

  @IsNotEmpty()
  @IsString()
  DB_PASS: string = null;

  @IsNotEmpty()
  @IsString()
  DB_NAME: string = null;

  // ---------------------------------------------------------------

  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string = null;

  @IsNotEmpty()
  @IsNumber()
  REDIS_PORT: number = null;

  @IsNotEmpty()
  @IsString()
  REDIS_PASSWORD: string = null;

  // ---------------------------------------------------------------
}
