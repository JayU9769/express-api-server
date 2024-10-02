import { Role } from '@prisma/client';
import { BaseService } from '@/services/base/base.service';
import { EUserType } from '@/interfaces/global.interface';
/**
 * Service class for handling role-related operations.
 * Extends the base service for CRUD functionality specific to the Role model.
 */
export declare class RoleService extends BaseService<Role> {
    /**
     * Constructor initializes the base service with the 'Role' model name.
     */
    constructor();
    query: import(".prisma/client").Prisma.RoleDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    /**
     * Retrieves all roles from the database.
     * @returns {Promise<Role[]>} - A promise that resolves to an array of roles.
     */
    findAll(type?: EUserType): Promise<Role[]>;
    /**
     * Finds a role by its unique ID.
     * @param {string} roleId - The ID of the role to find.
     * @returns {Promise<Role>} - A promise that resolves to the found role or throws an exception if not found.
     * @throws {HttpException} - Throws an exception if the role does not exist.
     */
    findById(roleId: string): Promise<Role>;
    /**
     * Creates a new role with the provided data.
     * @param {Role} data - The role data to create.
     * @returns {Promise<Role>} - A promise that resolves to the created role.
     * @throws {HttpException} - Throws an exception if the role name already exists.
     */
    create(data: Role): Promise<Role>;
    /**
     * Updates an existing role by its ID with the provided data.
     * Validates that the role name is unique across roles.
     * @param {string} roleId - The ID of the role to update.
     * @param {Role} data - The new data for the role.
     * @returns {Promise<Role>} - A promise that resolves to the updated role.
     * @throws {HttpException} - Throws an exception if the role name already exists for a different role.
     * @throws {HttpException} - Throws an exception if the role with the provided ID is not found.
     */
    update(roleId: string, data: Role): Promise<Role>;
    /**
     * Deletes roles by their IDs.
     * @param {string[]} roleIds - An array of role IDs to delete.
     * @returns {Promise<boolean>} - A promise that resolves to true if roles were successfully deleted.
     * @throws {HttpException} - Throws an exception if no roles were deleted.
     */
    delete(roleIds: string[]): Promise<boolean>;
}
