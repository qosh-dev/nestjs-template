import { Column } from "exceljs";

export interface ExcelCreatePageProps<Key> {
  sheetName: string;
  // headers:
  // headers: Partial<Column>[];
}

 interface ExcelPageColumn<K> {
  header: string;
  key: K;
}

export type PageColumn<K> = ExcelPageColumn<K> & Partial<Column>

export type PageData<K extends string> = {
  [key in K]: string;
};
