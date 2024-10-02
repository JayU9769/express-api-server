"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RoleController", {
    enumerable: true,
    get: function() {
        return RoleController;
    }
});
const _typedi = require("typedi");
const _roleservice = require("../services/role.service");
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
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = _object_without_properties_loose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
let RoleController = class RoleController {
    constructor(){
        _define_property(this, "role", _typedi.Container.get(_roleservice.RoleService));
        _define_property(this, "getRoles", async (req, res, next)=>{
            try {
                var _req_query_ignoreGlobal;
                const _req_query = req.query, { pageNumber = 0, perPage = 10, sort = 'createdAt', order = 'ASC' } = _req_query, filters = _object_without_properties(_req_query, [
                    "pageNumber",
                    "perPage",
                    "sort",
                    "order"
                ]);
                const options = {
                    pageNumber: Number(pageNumber) + 1,
                    perPage: Number(perPage),
                    filters: filters,
                    q: req.query.q,
                    ignoreGlobal: ((_req_query_ignoreGlobal = req.query.ignoreGlobal) === null || _req_query_ignoreGlobal === void 0 ? void 0 : _req_query_ignoreGlobal.split(',')) || [],
                    sort: String(sort),
                    order: String(order).toUpperCase()
                };
                const findAllRolesData = await this.role.findAllPaginate(options);
                res.status(200).json({
                    data: findAllRolesData,
                    message: 'findAll'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getRoleById", async (req, res, next)=>{
            try {
                const roleId = req.params.id;
                const findOneRoleData = await this.role.findById(roleId);
                res.status(200).json({
                    data: findOneRoleData,
                    message: 'findOne'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "createRole", async (req, res, next)=>{
            try {
                const roleData = req.body;
                const createRoleData = await this.role.create(roleData);
                res.status(201).json({
                    data: createRoleData,
                    message: 'created'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateRole", async (req, res, next)=>{
            try {
                const roleId = req.params.id;
                const roleData = req.body;
                const updateRoleData = await this.role.update(roleId, roleData);
                res.status(200).json({
                    data: updateRoleData,
                    message: 'updated'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "deleteRole", async (req, res, next)=>{
            try {
                const roleIds = req.body.ids;
                await this.role.delete(roleIds);
                res.status(200).json({
                    message: 'deleted'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateAction", async (req, res, next)=>{
            try {
                const { ids, field } = req.body;
                await this.role.updateAction({
                    ids,
                    field
                });
                res.status(200).json({
                    message: 'Updated Bulk Action'
                });
            } catch (error) {
                next(error);
            }
        });
    }
};

//# sourceMappingURL=role.controller.js.map