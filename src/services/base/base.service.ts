import {IDataTable, IFindAllPaginateOptions} from '@/interfaces/datatable.interface';
import {IUpdateAction, TRecord} from '@/interfaces/global.interface';
import {PrismaClient, Prisma} from '@prisma/client';

/**
 * Base service class providing common CRUD operations for any Prisma model.
 * Extends this class to add model-specific services.
 * @template T - The type of the model being handled by the service.
 */
export abstract class BaseService<T extends object> {
  protected readonly prisma: PrismaClient; // Prisma client instance
  protected model: string; // The name of the model to work with

  /**
   * Initializes the BaseService with a model name.
   * @param {string} modelName - The name of the model to use in queries.
   */
  constructor(modelName: string) {
    // Optional: Uncomment the next line if using a centralized Prisma connection
    // this.prisma = prisma; // Replace `prisma` with your centralized connection if necessary.

    // Alternative: Initialize Prisma directly in BaseService (if no centralized connection)
    this.prisma = new PrismaClient(); // Initializes Prisma client
    this.model = modelName; // Assigns the model name
  }

  /**
   * Retrieves the attributes (fields) of the model.
   * @returns {string[]} - An array of field names of the model.
   */
  protected getModelAttributes(): string[] {
    // Retrieve the model fields from Prisma's data model
    return Prisma.dmmf.datamodel.models
      .find(model => model.name === this.model)?.fields.map(field => field.name) || [];
  }

  /**
   * Updates specific fields for multiple records.
   * @param {IUpdateAction} action - The update action containing IDs and field to update.
   * @returns {Promise<number>} - A promise that resolves to the count of updated rows.
   * @throws {Error} - Throws an error if the update operation fails.
   */
  public async updateAction(
    {ids, field}: IUpdateAction, // Field object with name and value
  ): Promise<number> {
    const {name, value} = field;

    // Construct the update data dynamically
    const updateData: TRecord = {[name]: value};

    // Where clause to match the records by their IDs
    const whereClause = {id: {in: ids}};

    try {
      // Perform the update action on the records
      const updateResult = await this.prisma[this.model].updateMany({
        where: whereClause,
        data: updateData,
      });

      // Return the count of affected rows
      return updateResult.count;
    } catch (error) {
      // Handle errors gracefully by throwing a specific error message
      throw new Error(`Error updating column: ${error.message}`);
    }
  }

  /**
   * Retrieves paginated results of the model.
   * @param {IFindAllPaginateOptions} options - Options for pagination, filtering, sorting, and global search.
   * @returns {Promise<IDataTable<T>>} - A promise that resolves to a paginated table containing rows and count.
   */
  public async findAllPaginate(
    {
      pageNumber = 1,
      perPage = 10,
      filters = {},
      q,
      ignoreGlobal = [],
      sort = 'createdAt',
      order = 'ASC',
    }: IFindAllPaginateOptions = {}
  ): Promise<IDataTable<T>> {
    // Calculate the offset (skip) for pagination
    const skip = (pageNumber - 1) * perPage;

    // Build the Prisma "where" clause based on filters and search query
    const where: Prisma.UserWhereInput = this.buildWhereClause(filters, q, ignoreGlobal);

    // Perform the query to get paginated results
    const result = await this.prisma[this.model].findMany({
      where,
      skip,
      take: perPage,
      orderBy: {
        [sort]: order.toLowerCase(), // Sort by the specified field and order (ASC/DESC)
      },
    });

    // Count the total number of records that match the filters
    const count = await this.prisma[this.model].count({where});

    // Return the paginated data and the total count
    return {
      count,
      rows: result as T[],
    };
  }

  /**
   * Builds the Prisma "where" clause dynamically based on filters, global search, and ignored fields.
   * @param {Record<string, any>} filters - Key-value pairs of fields to filter by.
   * @param {string} [q] - Global search query.
   * @param {string[]} [ignoreGlobal] - Fields to ignore in the global search.
   * @returns {Prisma.UserWhereInput} - The dynamically constructed where clause.
   */
  private buildWhereClause(filters: Record<string, any>, q?: string, ignoreGlobal: string[] = []): Prisma.UserWhereInput {
    const whereClause: Prisma.UserWhereInput = {};

    // Add field-specific filters to the where clause
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && key !== 'q') {
        // Apply string filters with case-insensitive match
        if (typeof filters[key] === 'string') {
          whereClause[key] = {
            contains: filters[key],
            mode: 'insensitive',
          };
        } else {
          whereClause[key] = filters[key]; // Apply non-string filters directly
        }
      }
    });

    // Add global search conditions if the search query `q` is provided
    if (q) {
      const globalSearchConditions: Prisma.UserWhereInput[] = [];

      // Iterate over the model fields (attributes) for global search
      for (const key of Object.keys(this.getModelAttributes())) {
        if (!ignoreGlobal.includes(key)) {
          // Add global search condition for the field
          globalSearchConditions.push({
            [key]: {
              contains: q,
              mode: 'insensitive',
            },
          });
        }
      }

      // Combine global search conditions using AND operator
      if (globalSearchConditions.length > 0) {
        whereClause.AND = globalSearchConditions;
      }
    }

    return whereClause;
  }
}
