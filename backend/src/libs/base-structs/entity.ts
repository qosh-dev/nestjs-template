import { IFindOneBase } from 'src/libs/types/interfaces/find-one-base.interface';
import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity implements IFindOneBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
