import { UnprocessableEntityException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { IsDefined, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { EnumAsUnion } from 'src/libs/base-structs/types';
import { IdsDtoOptional } from 'src/libs/dto/ids.dto';

import { isEqualStringArray } from 'src/libs/common/methods';
import { SortOrderEnum } from '../enums/sort.enum';
import {
  IFindManyBase,
  IFindManyBaseSortItem,
} from '../interfaces/find-many-base.interface';

function FindManyBaseSortItem<SEnum extends Record<string, string>>(
  SortEnum: SEnum,
) {
  
  class Class implements IFindManyBaseSortItem<SEnum> {
    @ApiProperty({
      description: 'Sort by column item',
      required: true,
      type: 'enum',
      enum: SortEnum,
    })
    @IsEnum(SortEnum)
    @IsDefined()
    @Expose()
    column: EnumAsUnion<SEnum> = null;

    @ApiProperty({
      description: 'Sort by column item',
      required: true,
      type: 'enum',
      enum: SortOrderEnum,
    })
    @IsEnum(SortOrderEnum)
    @IsDefined()
    @Expose()
    order: SortOrderEnum = null;
  }

  return Class;
}

export function FindManyBaseDto<SEnum extends Record<string, string>>(
  SortEnum: SEnum,
) {
  const SortModel = FindManyBaseSortItem(SortEnum);

  function getSortDescription() {
    const cols = `Allowed column: (${Object.values(SortEnum).join(', ')})`;
    const orders = `Allowed order: (${Object.values(SortOrderEnum).join(
      ', ',
    )})`;

    const key = Object.keys(SortEnum)[0];
    const example = `{ "column": "${SortEnum[key]}", "order": "${
      Math.round(Math.random()) >= 0.5 ? 'ASC' : 'DESC'
    }" }`;

    return [cols, orders, example].join('<br/> ');
  }
  class Class extends IdsDtoOptional implements IFindManyBase<SEnum> {
    @ApiProperty({
      description: 'Records page',
      required: false,
    })
    @Expose()
    @Transform((t) => {
      const v = Number(t.value);
      return !isNaN(v) ? v : 1;
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
      description: 'Records limit per page',
      required: false,
    })
    @Expose()
    @Transform((t) => {
      const v = Number(t.value);
      return !isNaN(v) ? v : 10;
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiProperty({
      description: getSortDescription(),
      required: false,
      isArray: true,
      type: 'string',
      example: [
        `{ "column": "${Object.values(SortEnum)[0]}", "order": "DESC" }`,
      ],
    })
    @Expose()
    @Transform(({ value }) => {
      let values = [];
      if (typeof value === 'string') {
        values.push(value);
      } else if (Array.isArray(value)) {
        values.push(...value);
      }
      return values.map((item) => ValidateAndTransform(item));
    })
    sort?: IFindManyBaseSortItem<SEnum>[] = [];
  }

  function ValidateAndTransform<T>(plain: any) {
    try {
      const obj = JSON.parse(plain);
      const modelKeys = Object.getOwnPropertyNames(new SortModel());
      const objKeys = Object.keys(obj);
      if (!isEqualStringArray(modelKeys, objKeys)) {
        throw new UnprocessableEntityException('Invalid payload');
      }
      const model = plainToInstance(SortModel, obj);
      const columnEnum = Object.values(SortEnum);
      const orderEnum = Object.values(SortOrderEnum);
      if (!columnEnum.includes(model.column)) {
        throw new UnprocessableEntityException(
          `Invalid sort.column: ${model.column}`,
        );
      }
      if (!orderEnum.includes(model.order)) {
        throw new UnprocessableEntityException(
          `Invalid sort.order: ${model.order}`,
        );
      }
      return model;
    } catch {
      throw new UnprocessableEntityException('Invalid payload');
    }
  }

  return Class;
}
