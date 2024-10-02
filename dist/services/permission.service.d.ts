import { Permission, Prisma, RoleHasPermission } from '@prisma/client';
import { BaseService } from '@/services/base/base.service';
import { EUserType, TRecord } from '@/interfaces/global.interface';
import { IUpdatePermission } from '@/interfaces/permission.interface';
/**
 * Service class for handling permission-related operations.
 * Extends the base service for CRUD functionality specific to the Permission model.
 */
export declare class PermissionService extends BaseService<Permission> {
    private redis;
    /**
     * Constructor initializes the base service with the 'Permission' model name.
     */
    constructor();
    query: Prisma.PermissionDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    /**
     * Retrieves all permissions from the database, optionally filtered by user type.
     * @param {EUserType} [type] - Optional type filter for permissions.
     * @returns {Promise<Permission[]>} - A promise that resolves to an array of permissions.
     */
    findAll(type?: EUserType): Promise<Permission[]>;
    /**
     * Retrieves all role-permission relationships from the database.
     * @returns {Promise<RoleHasPermission[]>} - A promise that resolves to an array of role-permission relationships.
     */
    findAllRoleHasPermissions(): Promise<RoleHasPermission[]>;
    /**
     * Updates role permissions based on provided data. Adds or removes role-permission relationships.
     * @param {IUpdatePermission} data - Data containing role, permission, and action (add/remove).
     */
    updatePermission(data: IUpdatePermission): Promise<void>;
    /**
     * Retrieves permissions from the database, grouped by role type and role name.
     * If cached data exists, it returns the cached data unless the `forceUpdate` flag is set to true.
     *
     * @param {boolean} forceUpdate - Optional flag to force cache update. If true, data will be fetched from the database and the cache will be updated.
     * @returns {Promise<TRecord>} - A promise that resolves to a record of permissions grouped by role type and role name.
     */
    getPermissions(forceUpdate?: boolean): Promise<TRecord>;
    /**
     * Finds a permission by its unique ID.
     * @param {string} permissionId - The ID of the permission to find.
     * @returns {Promise<Permission>} - A promise that resolves to the found permission or throws an exception if not found.
     * @throws {HttpException} - Throws an exception if the permission does not exist.
     */
    findById(permissionId: string): Promise<Permission>;
    /**
     * Creates a new permission with the provided data.
     * @param {Permission} data - The permission data to create.
     * @returns {Promise<Permission>} - A promise that resolves to the created permission.
     * @throws {HttpException} - Throws an exception if the permission name already exists.
     */
    create(data: Permission): Promise<Permission>;
    /**
     * Updates an existing permission by its ID with the provided data.
     * Validates that the permission name is unique across permissions.
     * @param {string} permissionId - The ID of the permission to update.
     * @param {Permission} data - The new data for the permission.
     * @returns {Promise<Permission>} - A promise that resolves to the updated permission.
     * @throws {HttpException} - Throws an exception if the permission name already exists for a different permission.
     * @throws {HttpException} - Throws an exception if the permission with the provided ID is not found.
     */
    update(permissionId: string, data: Permission): Promise<Permission>;
    /**
     * Deletes permissions by their IDs.
     * @param {string[]} permissionIds - An array of permission IDs to delete.
     * @returns {Promise<boolean>} - A promise that resolves to true if permissions were successfully deleted.
     * @throws {HttpException} - Throws an exception if no permissions were deleted.
     */
    delete(permissionIds: string[]): Promise<boolean>;
}
