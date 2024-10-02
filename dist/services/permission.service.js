"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const HttpException_1 = require("@/exceptions/HttpException");
const base_service_1 = require("@/services/base/base.service");
const redis_1 = require("@/config/redis");
/**
 * Service class for handling permission-related operations.
 * Extends the base service for CRUD functionality specific to the Permission model.
 */
let PermissionService = class PermissionService extends base_service_1.BaseService {
    /**
     * Constructor initializes the base service with the 'Permission' model name.
     */
    constructor() {
        super('Permission'); // Passes the model name to the base service
        // Singleton instance of Redis service for caching purposes
        this.redis = redis_1.RedisService.getInstance();
        // Prisma query to interact with the permission table
        this.query = this.prisma.permission;
    }
    /**
     * Retrieves all permissions from the database, optionally filtered by user type.
     * @param {EUserType} [type] - Optional type filter for permissions.
     * @returns {Promise<Permission[]>} - A promise that resolves to an array of permissions.
     */
    async findAll(type) {
        const whereCondition = {};
        if (type) {
            whereCondition.type = type; // Add type condition if specified
        }
        return this.prisma.permission.findMany({
            where: whereCondition,
        });
    }
    /**
     * Retrieves all role-permission relationships from the database.
     * @returns {Promise<RoleHasPermission[]>} - A promise that resolves to an array of role-permission relationships.
     */
    async findAllRoleHasPermissions() {
        return this.prisma.roleHasPermission.findMany();
    }
    /**
     * Updates role permissions based on provided data. Adds or removes role-permission relationships.
     * @param {IUpdatePermission} data - Data containing role, permission, and action (add/remove).
     */
    async updatePermission(data) {
        const { role, value, permission } = data;
        const tempRole = await this.prisma.role.findUnique({ where: { id: role.id, isSystem: 1 } });
        if (tempRole)
            throw new HttpException_1.HttpException(422, 'Can not change permissions of System roles');
        // If the permission has no parentId, find its child permissions
        const permissions = permission.parentId ? [permission] : await this.prisma.permission.findMany({ where: { parentId: permission.id } });
        // Map permissions to create role-permission relationships
        const rolesWithPermissions = permissions.map(p => ({
            roleId: role.id,
            permissionId: p.id,
        }));
        // If there are no permissions, exit early
        if (rolesWithPermissions.length === 0)
            return;
        // If value is true, add role-permission relationships, otherwise delete them
        value
            ? await this.prisma.roleHasPermission.createMany({
                data: rolesWithPermissions,
                skipDuplicates: true,
            })
            : await this.prisma.roleHasPermission.deleteMany({
                where: {
                    OR: rolesWithPermissions.map(({ roleId, permissionId }) => ({
                        roleId,
                        permissionId,
                    })),
                },
            });
        // Refresh cached permissions
        this.getPermissions(true);
    }
    /**
     * Retrieves permissions from the database, grouped by role type and role name.
     * If cached data exists, it returns the cached data unless the `forceUpdate` flag is set to true.
     *
     * @param {boolean} forceUpdate - Optional flag to force cache update. If true, data will be fetched from the database and the cache will be updated.
     * @returns {Promise<TRecord>} - A promise that resolves to a record of permissions grouped by role type and role name.
     */
    async getPermissions(forceUpdate = false) {
        // Check if the permissions are cached and return from cache if not forced to update
        const cachedPermissions = await this.redis.get('permissions');
        if (cachedPermissions && !forceUpdate) {
            return JSON.parse(cachedPermissions);
        }
        // Fetch permissions from the database
        const permissions = {};
        const rolesWithPermissions = await this.prisma.role.findMany({
            include: {
                roleHasPermissions: {
                    include: {
                        permission: true, // Include permission details in the role-permission relationship
                    },
                },
            },
        });
        // Group permissions by role type and role name
        if (rolesWithPermissions.length > 0) {
            rolesWithPermissions.forEach(role => {
                if (!permissions[role.type]) {
                    permissions[role.type] = {};
                }
                permissions[role.type][role.name] = role.roleHasPermissions.map(rhp => rhp.permission.name);
            });
            // Cache the new permissions data in Redis
            await this.redis.set('permissions', JSON.stringify(permissions));
        }
        return permissions;
    }
    /**
     * Finds a permission by its unique ID.
     * @param {string} permissionId - The ID of the permission to find.
     * @returns {Promise<Permission>} - A promise that resolves to the found permission or throws an exception if not found.
     * @throws {HttpException} - Throws an exception if the permission does not exist.
     */
    async findById(permissionId) {
        const findPermission = await this.prisma.permission.findUnique({
            where: { id: permissionId },
        });
        if (!findPermission)
            throw new HttpException_1.HttpException(409, "Permission doesn't exist");
        return findPermission;
    }
    /**
     * Creates a new permission with the provided data.
     * @param {Permission} data - The permission data to create.
     * @returns {Promise<Permission>} - A promise that resolves to the created permission.
     * @throws {HttpException} - Throws an exception if the permission name already exists.
     */
    async create(data) {
        // Check if a permission with the same name already exists
        const findPermission = await this.prisma.permission.findUnique({
            where: { name: data.name },
        });
        if (findPermission)
            throw new HttpException_1.HttpException(409, `This permission ${data.name} already exists`);
        // Remove ID field and create a new permission
        delete data.id;
        return this.prisma.permission.create({ data });
    }
    /**
     * Updates an existing permission by its ID with the provided data.
     * Validates that the permission name is unique across permissions.
     * @param {string} permissionId - The ID of the permission to update.
     * @param {Permission} data - The new data for the permission.
     * @returns {Promise<Permission>} - A promise that resolves to the updated permission.
     * @throws {HttpException} - Throws an exception if the permission name already exists for a different permission.
     * @throws {HttpException} - Throws an exception if the permission with the provided ID is not found.
     */
    async update(permissionId, data) {
        // Find the permission by ID to ensure the permission exists
        const findPermission = await this.prisma.permission.findUnique({
            where: { id: permissionId },
        });
        // Throw an error if the permission is not found
        if (!findPermission) {
            throw new HttpException_1.HttpException(404, `Permission with ID ${permissionId} not found`);
        }
        // Check if another permission with the same name exists
        if (data.name && data.name.toLowerCase() !== findPermission.name.toLowerCase()) {
            const existingPermissionWithName = await this.prisma.permission.findUnique({
                where: { name: data.name },
            });
            // Throw an error if a permission with the same name exists
            if (existingPermissionWithName) {
                throw new HttpException_1.HttpException(409, `Permission name ${data.name} is already in use by another permission`);
            }
        }
        // Update the permission with the new data
        return this.prisma.permission.update({
            where: { id: permissionId },
            data: data,
        });
    }
    /**
     * Deletes permissions by their IDs.
     * @param {string[]} permissionIds - An array of permission IDs to delete.
     * @returns {Promise<boolean>} - A promise that resolves to true if permissions were successfully deleted.
     * @throws {HttpException} - Throws an exception if no permissions were deleted.
     */
    async delete(permissionIds) {
        // Delete permissions by their IDs
        const result = await this.prisma.permission.deleteMany({
            where: {
                id: { in: permissionIds },
            },
        });
        // Throw an error if no permissions were deleted
        if (!result.count)
            throw new HttpException_1.HttpException(409, "Permission doesn't exist");
        return true;
    }
};
exports.PermissionService = PermissionService;
exports.PermissionService = PermissionService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], PermissionService);
//# sourceMappingURL=permission.service.js.map