import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { IPaginationBase } from '../interfaces/pagination-base.interface';

export class PaginationBaseDto implements IPaginationBase {
  @ApiProperty({
    description: 'Records page',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  @Transform((t) => {
    const v = Number(t.value);
    return !isNaN(v) ? v : 1;
  })
  page?: number = 1;

  @ApiProperty({
    description: 'Records limit per page',
    required: false,
  })
  @IsOptional()
  @Expose()
  @Transform((t) => {
    const v = Number(t.value);
    return !isNaN(v) ? v : 10;
  })
  @IsInt()
  limit?: number = 10;
}
