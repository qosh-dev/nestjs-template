import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumberString, IsOptional } from "class-validator";
import { IFindDate } from "../interfaces/find-date-base.interface";

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

}