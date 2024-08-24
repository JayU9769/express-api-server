import { FindAndCountOptions, Model, ModelCtor } from 'sequelize';
import {TSortType} from "@/interfaces/global.interface";

export interface DataTable<T> {
  count: number;
  rows: T[];
}

export class BaseService<T extends Model> {
  constructor(private model: ModelCtor<T>) {}

  public async findAllPaginate(
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any = {},
    sort: string = 'createdAt',
    order: TSortType = 'ASC',
  ): Promise<DataTable<T>> {
    const offset = (pageNumber - 1) * perPage;

    const options: FindAndCountOptions = {
      where: filters,
      limit: perPage,
      offset: offset,
      order: [[sort, order]],
    };

    const result = await this.model.findAndCountAll(options);
    return {
      count: result.count,
      rows: result.rows,
    };
  }
}
