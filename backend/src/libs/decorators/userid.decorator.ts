import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const authHeader = req.headers['authorization'];

    const token = authHeader.split(' ')[1];

    const payload: Payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as undefined as Payload;

    return payload.data.id;
  },
);

type Payload = {
  data: { id: number; email: string };
};
