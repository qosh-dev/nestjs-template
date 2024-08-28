import { EnumAsUnion } from "src/libs/base-structs/types";

export enum SortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IFindPaginationBase {
  page?: number;
  limit?: number;
}

export interface IFindManyBase<SEnum extends Record<string, string>> extends IFindPaginationBase {
  ids?: string[];
  sort?: IFindManyBaseSortItem<SEnum>[];
}

export interface IFindManyBaseSortItem<SEnum extends Record<string, string>>{
  column: EnumAsUnion<SEnum>;
  order: SortOrderEnum;
}