"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PermissionService", {
    enumerable: true,
    get: function() {
        return PermissionService;
    }
});
const _typedi = require("typedi");
const _HttpException = require("../exceptions/HttpException");
const _baseservice = require("./base/base.service");
const _redis = require("../config/redis");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PermissionService = class PermissionService extends _baseservice.BaseService {
    async findAll(type) {
        const whereCondition = {};
        if (type) {
            whereCondition.type = type;
        }
        return this.prisma.permission.findMany({
            where: whereCondition
        });
    }
    async findAllRoleHasPermissions() {
        return this.prisma.roleHasPermission.findMany();
    }
    async updatePermission(data) {
        const { role, value, permission } = data;
        const tempRole = await this.prisma.role.findUnique({
            where: {
                id: role.id,
                isSystem: 1
            }
        });
        if (tempRole) throw new _HttpException.HttpException(422, 'Can not change permissions of System roles');
        const permissions = permission.parentId ? [
            permission
        ] : await this.prisma.permission.findMany({
            where: {
                parentId: permission.id
            }
        });
        const rolesWithPermissions = permissions.map((p)=>({
                roleId: role.id,
                permissionId: p.id
            }));
        if (rolesWithPermissions.length === 0) return;
        value ? await this.prisma.roleHasPermission.createMany({
            data: rolesWithPermissions,
            skipDuplicates: true
        }) : await this.prisma.roleHasPermission.deleteMany({
            where: {
                OR: rolesWithPermissions.map(({ roleId, permissionId })=>({
                        roleId,
                        permissionId
                    }))
            }
        });
        this.getPermissions(true);
    }
    async getPermissions(forceUpdate = false) {
        const cachedPermissions = await this.redis.get('permissions');
        if (cachedPermissions && !forceUpdate) {
            return JSON.parse(cachedPermissions);
        }
        const permissions = {};
        const rolesWithPermissions = await this.prisma.role.findMany({
            include: {
                roleHasPermissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });
        if (rolesWithPermissions.length > 0) {
            rolesWithPermissions.forEach((role)=>{
                if (!permissions[role.type]) {
                    permissions[role.type] = {};
                }
                permissions[role.type][role.name] = role.roleHasPermissions.map((rhp)=>rhp.permission.name);
            });
            await this.redis.set('permissions', JSON.stringify(permissions));
        }
        return permissions;
    }
    async findById(permissionId) {
        const findPermission = await this.prisma.permission.findUnique({
            where: {
                id: permissionId
            }
        });
        if (!findPermission) throw new _HttpException.HttpException(409, "Permission doesn't exist");
        return findPermission;
    }
    async create(data) {
        const findPermission = await this.prisma.permission.findUnique({
            where: {
                name: data.name
            }
        });
        if (findPermission) throw new _HttpException.HttpException(409, `This permission ${data.name} already exists`);
        delete data.id;
        return this.prisma.permission.create({
            data
        });
    }
    async update(permissionId, data) {
        const findPermission = await this.prisma.permission.findUnique({
            where: {
                id: permissionId
            }
        });
        if (!findPermission) {
            throw new _HttpException.HttpException(404, `Permission with ID ${permissionId} not found`);
        }
        if (data.name && data.name.toLowerCase() !== findPermission.name.toLowerCase()) {
            const existingPermissionWithName = await this.prisma.permission.findUnique({
                where: {
                    name: data.name
                }
            });
            if (existingPermissionWithName) {
                throw new _HttpException.HttpException(409, `Permission name ${data.name} is already in use by another permission`);
            }
        }
        return this.prisma.permission.update({
            where: {
                id: permissionId
            },
            data: data
        });
    }
    async delete(permissionIds) {
        const result = await this.prisma.permission.deleteMany({
            where: {
                id: {
                    in: permissionIds
                }
            }
        });
        if (!result.count) throw new _HttpException.HttpException(409, "Permission doesn't exist");
        return true;
    }
    constructor(){
        super('Permission'), _define_property(this, "redis", _redis.RedisService.getInstance()), _define_property(this, "query", this.prisma.permission);
    }
};
PermissionService = _ts_decorate([
    (0, _typedi.Service)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], PermissionService);

//# sourceMappingURL=permission.service.js.map