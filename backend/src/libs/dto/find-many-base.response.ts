import { ApiProperty } from '@nestjs/swagger';
import { IFindManyResponseBase } from '../interfaces/find-many-response-base.interface';

export class FindManyResponseBase<T> implements IFindManyResponseBase<T> {
  @ApiProperty({
    description: 'Count',
    required: true,
  })
  count: number;

  @ApiProperty({
    description: 'Total',
    required: true,
  })
  total: number;

  @ApiProperty({
    description: 'Page',
    required: true,
  })
  page: number;

  @ApiProperty({
    description: 'Page count',
    required: true,
  })
  pageCount: number;

  @ApiProperty({
    description: 'Records',
    required: true,
  })
  data: T[];

  // --------------------------------------------------------------------------------------------------------------

  /**
   * Generate new response model for GET /many requests
   * @param itemModel Response data item
   * @param modelName Related model name
   * @returns New model for get many
   */
  static apiSchema<M>(itemModel: M, modelName: string) {
    class FindManyResponse extends FindManyResponseBase<M> {
      @ApiProperty({
        description: 'Items',
        required: true,
        type: itemModel,
      })
      data: M[];
    }

    Object.defineProperty(FindManyResponse, 'name', {
      value: `GetMany${modelName}Response`,
    });
    return FindManyResponse;
  }
}
