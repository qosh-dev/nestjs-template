import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const Session = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const authorization = req.headers['authorization'];

    if (!authorization) {
      throw new HttpException('Invalid auth header', HttpStatus.BAD_REQUEST);
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new HttpException('Invalid auth header', HttpStatus.BAD_REQUEST);
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as unknown as {
        data: { id: number; deviceId: string };
      };

      return `user_${payload.data.id}:device_${payload.data.deviceId}`;
    } catch (e) {

      throw new HttpException(
        "Can't get session key, please, check authorization token",
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
  },
);
