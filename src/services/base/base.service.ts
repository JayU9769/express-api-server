import { DataTable, FindAllPaginateOptions } from '@/interfaces/datatable.interface';
import { FindOptions, CountOptions, Op } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';

export class BaseService<T extends Model> {
  constructor(protected model: ModelCtor<T>) {}
  public async findAllPaginate({
    pageNumber = 1,
    perPage = 10,
    filters = {},
    q,
    ignoreGlobal = [],
    sort = 'createdAt',
    order = 'ASC',
    include = [],
  }: FindAllPaginateOptions = {}): Promise<DataTable<T>> {
    const offset = (pageNumber - 1) * perPage;

    // Build the Sequelize "where" object dynamically
    const where: Record<string, any> = {};
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'string') {
        // Apply a case-insensitive like query for string filters
        where[key] = { [Op.like]: `%${value}%` };
      } else {
        // Apply equality or other operators as necessary
        where[key] = value;
      }
    }

    const options: FindOptions & CountOptions = {
      where: this.buildWhereClause(filters, q, ignoreGlobal),
      limit: perPage,
      offset: offset,
      order: [[sort, order]],
      include,
    };

    const result = await this.model.findAndCountAll(options);
    return {
      count: result.count,
      rows: result.rows as T[],
    };
  }

  private buildWhereClause(filters: Record<string, any>, q?: string, ignoreGlobal: string[] = []): Record<string, any> {
    const whereClause: Record<string, any> = {};

    // Add filters to where clause
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        // Apply LIKE operator for string filters, otherwise use equality
        if (typeof filters[key] === 'string') {
          whereClause[key] = {
            [Op.like]: `%${filters[key]}%`, // Use Op.like for MySQL
          };
        } else {
          whereClause[key] = filters[key];
        }
      }
    });

    // Add global search if `q` is provided
    if (q) {
      const globalSearchConditions: Record<string, any> = {};
      const attributes = this.model.getAttributes();

      for (const [key, value] of Object.entries(attributes)) {
        if (!ignoreGlobal.includes(key)) {
          globalSearchConditions[key] = {
            [Op.iLike]: `%${q}%`,
          };
        }
      }

      whereClause[Op.or as unknown as keyof typeof Op] = Object.entries(globalSearchConditions).map(([key, condition]) => ({
        [key]: condition,
      }));
    }

    return whereClause;
  }
}
