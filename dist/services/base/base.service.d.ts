import { IDataTable, IFindAllPaginateOptions } from '@/interfaces/datatable.interface';
import { IUpdateAction } from '@/interfaces/global.interface';
import { PrismaClient } from '@prisma/client';
/**
 * Base service class providing common CRUD operations for any Prisma model.
 * Extends this class to add model-specific services.
 * @template T - The type of the model being handled by the service.
 */
export declare abstract class BaseService<T extends object> {
    protected readonly prisma: PrismaClient;
    protected model: string;
    /**
     * Initializes the BaseService with a model name.
     * @param {string} modelName - The name of the model to use in queries.
     */
    constructor(modelName: string);
    /**
     * Retrieves the attributes (fields) of the model.
     * @returns {string[]} - An array of field names of the model.
     */
    protected getModelAttributes(): string[];
    /**
     * Updates specific fields for multiple records.
     * @param {IUpdateAction} action - The update action containing IDs and field to update.
     * @returns {Promise<number>} - A promise that resolves to the count of updated rows.
     * @throws {Error} - Throws an error if the update operation fails.
     */
    updateAction({ ids, field }: IUpdateAction): Promise<number>;
    /**
     * Retrieves paginated results of the model.
     * @param {IFindAllPaginateOptions} options - Options for pagination, filtering, sorting, and global search.
     * @returns {Promise<IDataTable<T>>} - A promise that resolves to a paginated table containing rows and count.
     */
    findAllPaginate({ pageNumber, perPage, filters, q, ignoreGlobal, sort, order, }?: IFindAllPaginateOptions): Promise<IDataTable<T>>;
    /**
     * Builds the Prisma "where" clause dynamically based on filters, global search, and ignored fields.
     * @param {Record<string, any>} filters - Key-value pairs of fields to filter by.
     * @param {string} [q] - Global search query.
     * @param {string[]} [ignoreGlobal] - Fields to ignore in the global search.
     * @returns {Prisma.UserWhereInput} - The dynamically constructed where clause.
     */
    private buildWhereClause;
}
