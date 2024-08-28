import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({
    name: 'access_token',
    example: 'some.jwt.here',
    description: 'Lifetime 12h',
  })
  access_token: string;

  @ApiProperty({
    name: 'refresh_token',
    example: 'some.jwt.here',
    description: 'Lifetime 24h',
  })
  refresh_token: string;
}
