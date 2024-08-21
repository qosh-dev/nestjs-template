import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export function CurrentUser() {
  return createParamDecorator((_k, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().employee;
  })();
}
