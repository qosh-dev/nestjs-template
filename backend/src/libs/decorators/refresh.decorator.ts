import { HttpStatus, applyDecorators } from '@nestjs/common';
// import { RefreshGuard } from 'src/modules/auth/guards/refresh.guard';
import { ApiResponse } from '../open-api/decorators/api-response.decorator';

export const HasRefresh = () =>
  applyDecorators(
    ApiResponse(HttpStatus.UNAUTHORIZED),
    // ApiResponse(HttpStatus.FORBIDDEN, AuthError.INVALID_TOKEN),
    // ApiBearerAuth('JWT-auth'),
    // UseGuards(RefreshGuard),
  );
