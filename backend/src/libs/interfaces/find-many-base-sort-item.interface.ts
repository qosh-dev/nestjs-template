import { EnumAsUnion } from "src/libs/base-structs/types";
import { SortOrderEnum } from "../enums/sort.enum";

export interface IFindManyBaseSortItem<SEnum extends Record<string, string>> {
  column: EnumAsUnion<SEnum>;
  order: SortOrderEnum;
}
