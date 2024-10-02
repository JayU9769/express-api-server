"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _client = require("@prisma/client");
const _nodecache = /*#__PURE__*/ _interop_require_default(require("node-cache"));
const _typedi = require("typedi");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const prisma = new _client.PrismaClient();
const rolePermissionCache = new _nodecache.default({
    stdTTL: 60
});
let RolePermissionService = class RolePermissionService {
    async syncRoles(modelId, roleIds, modelType) {
        const existingRoles = await prisma.modelHasRole.findMany({
            where: {
                modelId,
                modelType
            }
        });
        const existingRoleIds = existingRoles.map((r)=>r.roleId);
        const rolesToAdd = roleIds.filter((roleId)=>!existingRoleIds.includes(roleId));
        const rolesToRemove = existingRoleIds.filter((roleId)=>!roleIds.includes(roleId));
        if (rolesToRemove.length > 0) {
            await prisma.modelHasRole.deleteMany({
                where: {
                    modelId: modelId,
                    modelType: modelType,
                    roleId: {
                        in: rolesToRemove
                    }
                }
            });
        }
        if (rolesToAdd.length > 0) {
            const roleAssociations = rolesToAdd.map((roleId)=>({
                    modelId: modelId,
                    roleId: roleId,
                    modelType: modelType
                }));
            await prisma.modelHasRole.createMany({
                data: roleAssociations
            });
        }
        this.invalidateCache(modelId, modelType);
    }
    async assignRole(modelId, roleId, modelType) {
        const role = await prisma.role.findUnique({
            where: {
                id: roleId
            }
        });
        if (!role) {
            throw new Error(`Role ${role.name} does not exist`);
        }
        await prisma.modelHasRole.create({
            data: {
                roleId: role.id,
                modelId,
                modelType
            }
        });
        this.invalidateCache(modelId, modelType);
    }
    async assignPermissionToRole(roleId, permissionId) {
        await prisma.roleHasPermission.create({
            data: {
                roleId,
                permissionId
            }
        });
    }
    async assignPermissionToUser(modelId, permissionId, modelType) {
        const userSpecificRole = await prisma.role.findFirst({
            where: {
                name: `${modelType}_specific_${modelId}`,
                type: modelType
            }
        });
        let roleId;
        if (!userSpecificRole) {
            const newRole = await prisma.role.create({
                data: {
                    name: `${modelType}_specific_${modelId}`,
                    type: modelType
                }
            });
            roleId = newRole.id;
            await this.assignRole(modelId, newRole.id, modelType);
        } else {
            roleId = userSpecificRole.id;
        }
        await this.assignPermissionToRole(roleId, permissionId);
        this.invalidateCache(modelId, modelType);
    }
    async hasRole(modelId, roleName, modelType) {
        const cacheKey = `${modelType}_roles_${modelId}`;
        const cachedRoles = rolePermissionCache.get(cacheKey);
        if (cachedRoles) {
            return cachedRoles.includes(roleName);
        }
        const roles = await prisma.modelHasRole.findMany({
            where: {
                modelId,
                modelType
            },
            include: {
                role: true
            }
        });
        const roleNames = roles.map((r)=>r.role.name);
        rolePermissionCache.set(cacheKey, roleNames);
        return roleNames.includes(roleName);
    }
    async hasPermission(modelId, permissionName, modelType) {
        const cacheKey = `${modelType}_permissions_${modelId}`;
        const cachedPermissions = rolePermissionCache.get(cacheKey);
        if (cachedPermissions) {
            return cachedPermissions.includes(permissionName);
        }
        const roles = await prisma.modelHasRole.findMany({
            where: {
                modelId,
                modelType
            },
            include: {
                role: {
                    include: {
                        roleHasPermissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        });
        const permissions = roles.flatMap((role)=>role.role.roleHasPermissions.map((rp)=>rp.permission.name));
        rolePermissionCache.set(cacheKey, permissions);
        return permissions.includes(permissionName);
    }
    async getRoles(modelId, modelType) {
        const cacheKey = `${modelType}_roles_${modelId}`;
        const cachedRoles = rolePermissionCache.get(cacheKey);
        if (cachedRoles) {
            return cachedRoles;
        }
        const roles = await prisma.modelHasRole.findMany({
            where: {
                modelId,
                modelType
            },
            include: {
                role: true
            }
        });
        const roleData = roles.map((r)=>({
                id: r.role.id,
                name: r.role.name
            }));
        rolePermissionCache.set(cacheKey, roleData);
        return roleData;
    }
    invalidateCache(modelId, modelType) {
        rolePermissionCache.del(`${modelType}_roles_${modelId}`);
        rolePermissionCache.del(`${modelType}_permissions_${modelId}`);
    }
};
RolePermissionService = _ts_decorate([
    (0, _typedi.Service)()
], RolePermissionService);
const _default = RolePermissionService;

//# sourceMappingURL=RolePermissionService.js.map