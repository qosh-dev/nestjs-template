import {
  BadRequestException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as lodash from 'lodash';
import { IFindManyBase } from 'src/libs/types/interfaces/find-many-base.interface';
import {
  EntityManager,
  EntityTarget,
  FindOptionsWhere,
  In,
  QueryFailedError,
} from 'typeorm';
import { CommonError } from '../common/common.error';
import { BaseEntity } from './entity';
import { IFindManyResponseBase } from './types';

export class RepositoryBase<Eb extends BaseEntity> {
  logger = new Logger(RepositoryBase.name);

  constructor(
    readonly orm: EntityManager,
    private readonly entityClass: EntityTarget<Eb>,
  ) {}

  tr<T>(tr: (entityManager: EntityManager) => Promise<T>): Promise<T> {
    return this.orm.transaction<T>(tr);
  }

  async createOne<P extends Eb>(
    payload: Partial<Omit<P, 'id'>>,
    t: EntityManager = this.orm,
  ): Promise<Eb> {
    try {
      let record = t.create(this.entityClass, payload as any);
      record = await t.save(record);
      return record;
    } catch (e) {
      throw new UnprocessableEntityException(e?.message);
    }
  }

  async findOneBy<E extends Eb>(
    where: FindOptionsWhere<E> | FindOptionsWhere<E>[],
  ): Promise<Eb> {
    try {
      const record = await this.orm.findOneBy(this.entityClass, where as any);
      return record;
    } catch (e) {
      const error = e as QueryFailedError;
      if (error.message.startsWith('invalid input syntax for type uuid')) {
        throw new BadRequestException(CommonError.INVALID_IDENTIFIER_TYPE);
      }
      this.logger.error({
        err: CommonError.INVALID_FILTER,
        e,
      });
      throw new BadRequestException(CommonError.INVALID_FILTER);
    }
  }

  async findManyBy<P extends IFindManyBase<any>>(
    payload: P,
  ): Promise<IFindManyResponseBase<Eb>> {
    try {
      if (payload.limit === 0) {
        return this.toManyResponse({
          page: payload.page,
          take: payload.limit,
          result: [],
          totalCount: 0,
        });
      }
      let { page = 1, limit = 10, sort, ids, ...fields } = payload;
      const skip = (page - 1) * limit;
      const alias = (this.entityClass as any).name.toLocaleLowerCase();
      const queryBuilder = this.orm.createQueryBuilder(this.entityClass, alias);
      if (ids && ids.length) {
        queryBuilder.andWhereInIds(ids);
      } else {
        for (let _field in fields) {
          if (!fields[_field]) continue;
          const { operand, prop, field, value } = this._baseConditions(
            _field,
            fields,
          );
          queryBuilder.andWhere(`${field} ${operand} :${prop}`, {
            [prop]: value,
          });
        }
      }

      if (sort && sort.length) {
        for (let s of sort) {
          queryBuilder.addOrderBy(`"${s.column}"`, s.order);
        }
      }
      const [records, totalCount] = await queryBuilder
        .take(limit)
        .skip(skip)
        .getManyAndCount();

      return this.toManyResponse({
        page: payload.page,
        take: payload.limit,
        result: records,
        totalCount: totalCount,
      });
    } catch (e) {
      const error = e as QueryFailedError;
      if (error.message.startsWith('invalid input syntax for type uuid')) {
        throw new BadRequestException(CommonError.INVALID_IDENTIFIER_TYPE);
      }
      throw new BadRequestException(CommonError.INVALID_FILTER);
    }
  }

  async countBy<E extends Eb>(
    where: FindOptionsWhere<E> | FindOptionsWhere<E>[],
  ) {
    try {
      return this.orm.count(this.entityClass, { where });
    } catch (e) {
      const error = e as QueryFailedError;
      if (error.message.startsWith('invalid input syntax for type uuid')) {
        throw new BadRequestException(CommonError.INVALID_IDENTIFIER_TYPE);
      }
      throw new BadRequestException(CommonError.INVALID_FILTER);
    }
  }

  async existAll(ids: string[]): Promise<boolean> {
    try {
      const count = await this.orm.count(this.entityClass, {
        where: { id: In(ids) } as any,
      });
      return count === ids.length;
    } catch (e) {
      const error = e as QueryFailedError;
      if (error.message.startsWith('invalid input syntax for type uuid')) {
        throw new BadRequestException(CommonError.INVALID_IDENTIFIER_TYPE);
      }
    }
  }

  async update<E extends Eb>(
    id: Eb['id'],
    props: Partial<E>,
    t: EntityManager = this.orm,
  ) {
    try {
      const res = await t.update(this.entityClass, { id }, props as any);
      return res.affected !== 0;
    } catch (e) {
      const error = e as QueryFailedError;
      this.logger.error(error);

      return false;
    }
  }

  async updateMany<E extends Eb>(
    ids: Eb['id'][],
    props: Partial<E>,
    t: EntityManager = this.orm,
  ) {
    try {
      const res = await t.update(
        this.entityClass,
        { id: In(ids) },
        props as any,
      );
      console.log({ res });
      return res.affected === ids.length;
    } catch (e) {
      const error = e as QueryFailedError;
      console.log({ error });
      this.logger.error(error);
      return false;
    }
  }

  async delete(id: Eb['id'], t: EntityManager = this.orm) {
    try {
      const res = await t.delete(this.entityClass, { id });
      return res.affected !== 0;
    } catch (e) {
      return false;
    }
  }

  async deleteMany(ids: Eb['id'][], t: EntityManager = this.orm) {
    try {
      const res = await t.delete(this.entityClass, { id: In(ids) });
      return res.affected !== 0;
    } catch (e) {
      return false;
    }
  }

  async deleteBy(criteria: Partial<Eb>, t: EntityManager = this.orm) {
    try {
      const res = await t.delete(this.entityClass, criteria);
      return res.affected !== 0;
    } catch (e) {
      return false;
    }
  }

  // ------------------------------------------------------------------------------

  _baseConditions<P extends IFindManyBase<any>>(
    field: string,
    fields: Omit<P, 'page' | 'limit' | 'sort' | 'ids'>,
  ) {
    let value = fields[field];
    let operand = '=';
    let prop = field;
    if (field.endsWith('Gte') || field.endsWith('Lte')) {
      operand = field.endsWith('Gte') ? '>=' : '<=';
      const tempField = field.substring(0, field.length - 3);
      prop = tempField;
      field = `"${tempField}"`;
    } else if (field.endsWith('Eq')) {
      const tempField = field.substring(0, field.length - 2);
      prop = tempField;
      field = `"${tempField}"`;
    } else if (field.endsWith('NotEq')) {
      const tempField = field.substring(0, field.length - 5);
      prop = tempField;
      field = `"${tempField}"`;
      operand = '!=';
    } else if (field.endsWith('NotContains')) {
      const tempField = field.substring(0, field.length - 11);
      prop = tempField;
      field = `NOT LOWER("${tempField}")`;
      operand = 'LIKE';
      value = `%${value.toLocaleLowerCase()}%`;
    } else if (field.endsWith('Contains')) {
      const tempField = field.substring(0, field.length - 8);
      prop = tempField;
      field = `LOWER("${tempField}")`;
      operand = 'LIKE';
      value = `%${value.toLocaleLowerCase()}%`;
    } else {
      field = `"${field}"`;
    }
    return { operand, prop, field, value };
  }

  joinStrIds(ids: string[]) {
    return ids.map((v) => `'${v}'`).join(',');
  }

  toManyResponse<T>(payload: {
    result: T[];
    take: number;
    totalCount: number;
    page: number;
  }): IFindManyResponseBase<T> {
    const pageCount = Math.round(payload.totalCount / payload.take);
    return {
      data: payload.result,
      count: payload.take ?? 0,
      total: payload.totalCount,
      page: payload.page ?? 0,
      pageCount: lodash.isNaN(pageCount) ? 0 : pageCount,
    };
  }
}
