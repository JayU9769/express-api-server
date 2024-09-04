import { IDataTable, IFindAllPaginateOptions } from '@/interfaces/datatable.interface';
import { IUpdateAction, TRecord } from '@/interfaces/global.interface';
import { PrismaClient, Prisma } from '@prisma/client';

export abstract class BaseService<T extends object> {
  protected readonly prisma: PrismaClient;

  protected model: string;
  constructor(modelName: string) {
    // Optional: If you have a dedicated connection file (e.g., prisma/connect.ts)
    // this.prisma = prisma; // Uncomment if using a centralized connection

    // Alternative: Initialize Prisma directly in BaseService (if no centralized connection)
    this.prisma = new PrismaClient();
    this.model = modelName;
  }

  protected getModelAttributes() {
    return Prisma.dmmf.datamodel.models.find(model => model.name === this.model)?.fields.map(field => field.name) || [];
  }

  public async updateAction(
    { ids, field }: IUpdateAction, // Field object with name and value
  ): Promise<number> {
    const { name, value } = field;

    const updateData: Record<string, any> = { [name]: value }; // Ensure type safety

    const whereClause = { id: { in: ids } }; // Apply update to records with IDs in the provided list

    try {
      const updateResult = await this.prisma[this.model].updateMany({
        where: whereClause,
        data: updateData,
      });

      // Return the count of affected rows (consider using select: { count: true } for efficiency)
      return updateResult.count;
    } catch (error) {
      // Handle errors gracefully, e.g., log the error and throw a specific exception
      throw new Error(`Error updating column: ${error.message}`);
    }
  }

  public async findAllPaginate({
    pageNumber = 1,
    perPage = 10,
    filters = {},
    q,
    ignoreGlobal = [],
    sort = 'createdAt',
    order = 'ASC',
  }: IFindAllPaginateOptions = {}): Promise<IDataTable<T>> {
    const skip = (pageNumber - 1) * perPage;

    // Build the Prisma "where" object dynamically
    const where: Prisma.UserWhereInput = this.buildWhereClause(filters, q, ignoreGlobal);

    // Construct Prisma query options
    const result = await this.prisma[this.model].findMany({
      where,
      skip,
      take: perPage,
      orderBy: {
        [sort]: order.toLowerCase(),
      },
    });

    // Count the total number of records
    const count = await this.prisma[this.model].count({ where });

    return {
      count,
      rows: result as T[],
    };
  }

  private buildWhereClause(filters: Record<string, any>, q?: string, ignoreGlobal: string[] = []): Prisma.UserWhereInput {
    const whereClause: Prisma.UserWhereInput = {};

    // Add filters to the where clause
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && key !== 'q') {
        // Apply string filters
        if (typeof filters[key] === 'string') {
          whereClause[key] = {
            contains: filters[key],
            mode: 'insensitive',
          };
        } else {
          whereClause[key] = filters[key];
        }
      }
    });

    // Add global search conditions if `q` is provided
    if (q) {
      const globalSearchConditions: Prisma.UserWhereInput[] = [];

      // Iterate over the fields (attributes) of the model
      for (const key of Object.keys(this.getModelAttributes())) {
        if (!ignoreGlobal.includes(key)) {
          globalSearchConditions.push({
            [key]: {
              contains: q,
              mode: 'insensitive',
            },
          });
        }
      }

      // Combine global search conditions using OR operator
      if (globalSearchConditions.length > 0) {
        whereClause.AND = globalSearchConditions;
      }
    }

    return whereClause;
  }
}
