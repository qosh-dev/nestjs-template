import { AnaliticSegment } from "src/modules/operation/type/find-analitic-range.interface";

export interface IFindDate {
  dateGte?: number;
  dateLte?: number;
  segment: AnaliticSegment;

}