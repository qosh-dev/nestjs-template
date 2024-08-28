import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNumberString, IsOptional } from "class-validator";
import { AnaliticSegment } from "src/modules/operation/type/find-analitic-range.interface";
import { IFindDate } from "../types/interfaces/find-date-base.interface";

export class FindDateDto implements IFindDate {
  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Expose()
  @IsNumberString()
  dateGte: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Expose()
  @IsNumberString()
  dateLte: number;

  @ApiProperty({
    required: false,
    enum: AnaliticSegment
  })
  @IsOptional()
  @Expose()
  @IsEnum(AnaliticSegment)
  segment: AnaliticSegment;
}