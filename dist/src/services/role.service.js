"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RoleService", {
    enumerable: true,
    get: function() {
        return RoleService;
    }
});
const _typedi = require("typedi");
const _HttpException = require("../exceptions/HttpException");
const _baseservice = require("./base/base.service");
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
let RoleService = class RoleService extends _baseservice.BaseService {
    async findAll(type) {
        const whereCondition = {};
        if (type) {
            whereCondition.type = type;
        }
        return this.prisma.role.findMany({
            where: whereCondition
        });
    }
    async findById(roleId) {
        const findRole = await this.prisma.role.findUnique({
            where: {
                id: roleId
            }
        });
        if (!findRole) throw new _HttpException.HttpException(409, "Role doesn't exist");
        return findRole;
    }
    async create(data) {
        const findRole = await this.prisma.role.findUnique({
            where: {
                name: data.name
            }
        });
        if (findRole) throw new _HttpException.HttpException(409, `This role ${data.name} already exists`);
        delete data.id;
        return this.prisma.role.create({
            data
        });
    }
    async update(roleId, data) {
        const findRole = await this.prisma.role.findUnique({
            where: {
                id: roleId
            }
        });
        if (!findRole) {
            throw new _HttpException.HttpException(404, `Role with ID ${roleId} not found`);
        }
        if (data.name && data.name.toLowerCase() !== findRole.name.toLowerCase()) {
            const existingRoleWithName = await this.prisma.role.findUnique({
                where: {
                    name: data.name
                }
            });
            if (existingRoleWithName) {
                throw new _HttpException.HttpException(409, `Role name ${data.name} is already in use by another role`);
            }
        }
        return this.prisma.role.update({
            where: {
                id: roleId
            },
            data: data
        });
    }
    async delete(roleIds) {
        const result = await this.prisma.role.deleteMany({
            where: {
                id: {
                    in: roleIds
                },
                isSystem: 0
            }
        });
        if (!result.count) throw new _HttpException.HttpException(409, "Role doesn't exist");
        return true;
    }
    constructor(){
        super('Role'), _define_property(this, "query", this.prisma.role);
    }
};
RoleService = _ts_decorate([
    (0, _typedi.Service)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], RoleService);

//# sourceMappingURL=role.service.js.map