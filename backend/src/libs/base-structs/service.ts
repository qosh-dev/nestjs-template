import { HttpException, HttpStatus } from '@nestjs/common';
import { ICreateOneBase } from 'src/libs/interfaces/create-one-base.interface';
import { IFindManyBase } from 'src/libs/interfaces/find-many-base.interface';
import { IFindOneBase } from 'src/libs/interfaces/find-one-base.interface';
import { EntityManager } from 'typeorm';
import { IFindManyResponseBase } from '../interfaces/find-many-response-base.interface';
import { BaseEntity } from './entity';
import { RepositoryBase } from './repository';

export class BaseService<Eb extends BaseEntity> {
  constructor(readonly repo: RepositoryBase<Eb>) {}

  createOne(props: ICreateOneBase, t?: EntityManager) {
    return this.repo.createOne(props, t);
  }

  async findOne<I extends IFindOneBase>(payload: I): Promise<Eb | null> {
    const filters = Object.values(payload).filter((f) => f);
    if (!filters.length) {
      return null;
    }
    return this.repo.findOneBy(payload as any);
  }

  async findMany<I extends IFindManyBase<any>>(
    payload: I,
  ): Promise<IFindManyResponseBase<Eb>> {
    return this.repo.findManyBy(payload);
  }

  async edit(
    id: Required<IFindOneBase['id']>,
    props: Partial<Omit<Eb, 'id'>>,
    t = this.repo.orm,
  ) {
    const filters = Object.values(props).filter((f) => f);
    if (!filters.length) {
      return false;
    }
    const recordExist = await this.repo.findOneBy({ id } as any);

    if (!recordExist) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    await this.repo.update(id as any, props as any, t);
    return true;
  }

  async delete(id: Required<IFindOneBase['id']>, t = this.repo.orm) {
    return this.repo.delete(id, t);
  }
}
