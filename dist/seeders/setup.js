"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const client_1 = require("@prisma/client");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
/**
 * The Setup class initializes the default roles, permissions, and admin accounts
 * in the database using Prisma ORM. It handles inserting roles, permissions,
 * admin users, and assigning permissions to roles and roles to admins.
 */
class Setup {
    constructor() {
        // Initialize Prisma Client to interact with the database
        this.prisma = new client_1.PrismaClient();
        // Default password for the admin account
        this.defaultPassword = '12345678';
        // Timestamp to be used for 'createdAt' and 'updatedAt' fields
        this.timestamp = new Date();
        /**
         * List of default roles to be created. Excludes 'id' since it will be auto-generated.
         */
        this.defaultRoles = [
            {
                name: 'admin',
                type: 'admin',
                status: 1,
                isSystem: 1,
                createdAt: this.timestamp,
                updatedAt: this.timestamp,
            },
        ];
        // List of roles to assign to the default admin account
        this.rolesForAdmin = ['admin'];
        /**
         * List of default permissions to be created. Includes dynamic CRUD permissions
         * (create, view, update, delete) for role, admin, and user.
         */
        this.defaultPermissions = [
            {
                name: 'role',
                type: 'admin',
                parentId: null,
                createdAt: this.timestamp,
                updatedAt: this.timestamp,
            },
            {
                name: 'admin',
                type: 'admin',
                parentId: null,
                createdAt: this.timestamp,
                updatedAt: this.timestamp,
            },
            {
                name: 'user',
                type: 'admin',
                parentId: null,
                createdAt: this.timestamp,
                updatedAt: this.timestamp,
            },
            {
                name: 'admin-dashboard',
                type: 'admin',
                parentId: 'admin',
                createdAt: this.timestamp,
                updatedAt: this.timestamp,
            },
            // Generate CRUD permissions for 'role', 'admin', and 'user'
            ...['create', 'view', 'update', 'delete'].flatMap(action => ['role', 'admin', 'user'].map(parent => ({
                name: `${parent}-${action}`,
                type: 'admin',
                parentId: parent,
                createdAt: this.timestamp,
                updatedAt: this.timestamp,
            }))),
            {
                name: 'admin-permission',
                type: 'admin',
                parentId: 'admin',
                createdAt: this.timestamp,
                updatedAt: this.timestamp,
            },
        ];
        /**
         * List of default admin users to be created. Excludes 'id' since it will be auto-generated.
         * Passwords are hashed using bcrypt.
         */
        this.defaultAdmins = [
            {
                email: 'admin@admin.com',
                name: 'Admin',
                password: bcryptjs_1.default.hashSync(this.defaultPassword),
                status: 1,
                isSystem: 1,
                createdAt: this.timestamp,
                updatedAt: this.timestamp,
            },
        ];
    }
    /**
     * Initializes the setup process by inserting default roles, permissions, and admins,
     * and assigning roles to admins.
     */
    async init() {
        console.info('Setup Started...');
        // Run the insert operations in parallel for efficiency
        await Promise.all([this.insertRoles(), this.insertAdmins(), this.insertPermissions()]);
        // Assign permissions to the role and role to admins
        this.assignPermissionsToRole();
        await this.assignRoleToAdmin();
        console.info('Setup Complete...');
    }
    /**
     * Inserts the default roles into the database. Skips inserting any duplicates
     * based on role name.
     */
    async insertRoles() {
        console.info('Inserting Roles...');
        await this.prisma.role.createMany({
            data: this.defaultRoles,
            skipDuplicates: true,
        });
    }
    /**
     * Inserts the default permissions into the database.
     * First inserts parent permissions (those without a parentId),
     * and then links child permissions to their parent using parentId.
     */
    async insertPermissions() {
        console.info('Inserting Permissions...');
        // Separate parent and child permissions
        const parentPermissions = this.defaultPermissions.filter(p => !p.parentId);
        const childPermissions = this.defaultPermissions.filter(p => p.parentId);
        // Insert parent permissions
        await this.prisma.permission.createMany({
            data: parentPermissions,
            skipDuplicates: true,
        });
        // Fetch parent permissions from the database
        const parentRecords = await this.prisma.permission.findMany({
            where: {
                name: { in: parentPermissions.map(p => p.name) },
            },
            select: { id: true, name: true },
        });
        // Map parent permission names to their IDs
        const parentMap = new Map(parentRecords.map(p => [p.name, p.id]));
        // Insert child permissions and link them to their parent ID
        await this.prisma.permission.createMany({
            data: childPermissions.map(p => (Object.assign(Object.assign({}, p), { parentId: parentMap.get(p.parentId) }))),
            skipDuplicates: true,
        });
    }
    /**
     * Inserts default admin users into the database. Skips inserting any duplicates
     * based on the email field.
     */
    async insertAdmins() {
        console.info('Inserting Admins...');
        await this.prisma.admin.createMany({
            data: this.defaultAdmins,
            skipDuplicates: true,
        });
    }
    /**
     * Assigns the 'admin' role to the default admin users. Links each admin to
     * the 'admin' role in the `ModelHasRole` table.
     */
    async assignRoleToAdmin() {
        console.info('Assigning roles to admins...');
        // Fetch both admin users and roles to create role assignments
        const [admins, roles] = await Promise.all([
            this.prisma.admin.findMany({
                where: {
                    email: { in: this.defaultAdmins.map(admin => admin.email) },
                },
                select: { id: true },
            }),
            this.prisma.role.findMany({
                where: {
                    name: { in: this.rolesForAdmin },
                },
                select: { id: true },
            }),
        ]);
        if (admins.length && roles.length) {
            // Create the role assignments for each admin
            const modelHasRole = admins.flatMap(admin => roles.map(role => ({
                roleId: role.id,
                modelType: 'admin',
                modelId: admin.id,
                createdAt: this.timestamp,
                updatedAt: this.timestamp,
            })));
            // Insert the role assignments into the `ModelHasRole` table
            await this.prisma.modelHasRole.createMany({
                data: modelHasRole,
                skipDuplicates: true,
            });
        }
    }
    /**
     * Assigns permissions to the 'admin' role. Links permissions that are child permissions
     * to the appropriate admin role in the `RoleHasPermission` table.
     */
    async assignPermissionsToRole() {
        console.info('Assigning permissions to roles...');
        // Fetch all admin system roles
        const roles = await this.prisma.role.findMany({
            where: {
                type: client_1.UserType.admin,
                isSystem: 1,
            },
            select: { id: true },
        });
        // Fetch permissions that have a parentId (i.e., child permissions)
        const permissions = await this.prisma.permission.findMany({
            where: {
                type: client_1.UserType.admin,
                parentId: { not: null },
            },
            select: { id: true },
        });
        // Assign permissions to roles
        const roleHasPermissions = roles.flatMap(role => permissions.map(permission => ({
            roleId: role.id,
            permissionId: permission.id,
        })));
        // Insert the role-permission assignments into the `RoleHasPermission` table
        await this.prisma.roleHasPermission.createMany({
            data: roleHasPermissions,
        });
    }
}
// Initialize and run the setup process
new Setup().init();
//# sourceMappingURL=setup.js.map