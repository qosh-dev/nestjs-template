import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum NodeEnv {
  test = 'test',
  development = 'development',
  production = 'production',
}

export class EnvironmentVariables {
  @IsNotEmpty()
  @IsEnum(NodeEnv)
  @IsString()
  NODE_ENV: NodeEnv = NodeEnv.development;

  // ---------------------------------------------------------------

  @IsNotEmpty()
  @IsString({ each: true })
  @Transform((t) => {
    if (t.value === '*') {
      return '*';
    }

    const splitted = t.value.split(',');
    if (splitted.length === 1) {
      return [t.value];
    } else {
      return splitted;
    }
  })
  API_CORS_ORIGIN: string[] = [];

  @IsNotEmpty()
  @IsString()
  API_PREFIX: string = null;

  @IsNotEmpty()
  @IsNumber()
  API_PORT: number = null;

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
