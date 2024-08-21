import {
  HttpStatus,
  SetMetadata,
  applyDecorators
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

// import { JwtAndRoleGuard } from 'src/modules/auth/guards/jwt.auth.guard';
import { ApiResponse } from '../open-api/decorators/api-response.decorator';

export const Authorized = (permissions: any[] = []) =>
  applyDecorators(
    ApiResponse(HttpStatus.UNAUTHORIZED),
    ApiBearerAuth('JWT-auth'),
    // UseGuards(JwtAndRoleGuard),
    SetMetadata('permissions', permissions),
  );
