import { EnumAsUnion } from 'src/libs/base-structs/types';
import { SortOrderEnum } from '../enums/sort.enum';
import { IPaginationBase } from './pagination-base.interface';

export interface IFindManyBase<SEnum extends Record<string, string>>
  extends IPaginationBase {
  ids?: string[];
  sort?: IFindManyBaseSortItem<SEnum>[];
}

export interface IFindManyBaseSortItem<SEnum extends Record<string, string>> {
  column: EnumAsUnion<SEnum>;
  order: SortOrderEnum;
}
