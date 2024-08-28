import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { PageColumn, PageData } from './excel.types';

@Injectable()
export class ExcelService {
  constructor() {}

  async createPage<K extends string>(
    sheetName: string,
    headers: PageColumn<K>[],
    data: PageData<K>[],
  ) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = headers;

    data.forEach((val, i, _) => {
      worksheet.addRow(val);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return buffer;
  }
}
