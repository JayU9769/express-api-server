import { IDataTable, IFindAllPaginateOptions } from '@/interfaces/datatable.interface';
import { IUpdateAction, TRecord } from '@/interfaces/global.interface';
import { FindOptions, CountOptions, Op, UpdateOptions } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';

/**
 * BaseService provides generic data access functionality for Sequelize models,
 * including support for pagination, filtering, sorting, and global search.
 * @template T The model type that extends Sequelize's Model class.
 */
export class BaseService<T extends Model> {
  constructor(protected model: ModelCtor<T>) {}

  /**
   * Retrieves a paginated list of records from the database based on provided options.
   * Supports filtering, sorting, and global search.
   * @param options Pagination and filtering options.
   * @returns A data table object containing the total count and rows of the retrieved records.
   */
  public async findAllPaginate({
    pageNumber = 1,
    perPage = 10,
    filters = {},
    q,
    ignoreGlobal = [],
    sort = 'createdAt',
    order = 'ASC',
    include = [],
  }: IFindAllPaginateOptions = {}): Promise<IDataTable<T>> {
    const offset = (pageNumber - 1) * perPage;

    // Build the Sequelize "where" object dynamically
    const where: TRecord = {};
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'string') {
        // Apply a case-insensitive LIKE query for string filters
        where[key] = { [Op.like]: `%${value}%` };
      } else {
        // Apply equality or other operators as necessary
        where[key] = value;
      }
    }

    // Construct Sequelize query options
    const options: FindOptions & CountOptions = {
      where: this.buildWhereClause(filters, q, ignoreGlobal),
      limit: perPage,
      offset: offset,
      order: [[sort, order]],
      include,
    };

    // Execute the query with pagination and return the result
    const result = await this.model.findAndCountAll(options);
    return {
      count: result.count,
      rows: result.rows as T[],
    };
  }

  /**
   * Constructs a Sequelize "where" clause for filtering and global search.
   * @param filters Key-value pairs representing column filters.
   * @param q A global search query string.
   * @param ignoreGlobal An array of column names to ignore in the global search.
   * @returns A Sequelize "where" clause object.
   */
  private buildWhereClause(filters: TRecord, q?: string, ignoreGlobal: string[] = []): TRecord {
    const whereClause: TRecord = {};

    // Add filters to the where clause
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && key !== 'q') {
        // Apply LIKE operator for string filters, otherwise use equality
        if (typeof filters[key] === 'string') {
          whereClause[key] = {
            [Op.like]: `%${filters[key]}%`, // Use Op.like for partial matches
          };
        } else {
          whereClause[key] = filters[key];
        }
      }
    });

    // Add global search conditions if `q` is provided
    if (q) {
      const globalSearchConditions: Array<TRecord> = [];
      const attributes = this.model.getAttributes();

      // Iterate over the model's attributes (columns)
      for (const key of Object.keys(attributes)) {
        if (!ignoreGlobal.includes(key)) {
          globalSearchConditions.push({
            [key]: {
              [Op.like]: `%${q}%`, // Use LIKE operator for partial matches
            },
          });
        }
      }

      // Combine global search conditions using OR operator
      if (globalSearchConditions.length > 0) {
        whereClause[Op.or as unknown as keyof typeof Op] = globalSearchConditions;
      }
    }

    return whereClause;
  }

  /**
   * Updates a specific field for multiple records identified by their primary IDs.
   * @param ids Array of primary IDs of the records to be updated.
   * @param field An object containing the name of the column to update and its new value.
   * @returns The number of affected rows.
   */
  public async updateAction({ ids, field }: IUpdateAction): Promise<number> {
    // Destructure the field object to get the column name and value
    const { name, value } = field;

    // Define the update data as a generic record type
    const updateData: Partial<T> = { [name]: value } as Partial<T>;

    // Define the options for the update, including the where clause
    const options: UpdateOptions = {
      where: {
        id: {
          [Op.in]: ids, // Ensure the update applies to records with IDs in the provided list
        },
      },
    };

    // Perform the update operation and get the count of affected rows
    const [affectedRows] = await this.model.update(updateData, options);

    // Return the number of affected rows
    return affectedRows;
  }
}
