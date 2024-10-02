"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PermissionController", {
    enumerable: true,
    get: function() {
        return PermissionController;
    }
});
const _typedi = require("typedi");
const _roleservice = require("../services/role.service");
const _permissionservice = require("../services/permission.service");
const _HttpException = require("../exceptions/HttpException");
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
let PermissionController = class PermissionController {
    constructor(){
        _define_property(this, "role", _typedi.Container.get(_roleservice.RoleService));
        _define_property(this, "permission", _typedi.Container.get(_permissionservice.PermissionService));
        _define_property(this, "getPermissions", async (req, res, next)=>{
            try {
                const type = req.query.type;
                if (!type) {
                    throw new _HttpException.HttpException(422, 'Type is Required');
                }
                const permissions = await this.permission.findAll(type);
                const roleHasPermissions = await this.permission.findAllRoleHasPermissions();
                const roles = await this.role.findAll(type);
                res.status(200).json({
                    data: {
                        permissions,
                        roles,
                        roleHasPermissions
                    },
                    message: 'findAll'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updatePermission", async (req, res, next)=>{
            try {
                const body = req.body;
                await this.permission.updatePermission(body);
                res.status(200).json({
                    message: 'Permission updated'
                });
            } catch (error) {
                next(error);
            }
        });
    }
};

//# sourceMappingURL=permission.controller.js.map