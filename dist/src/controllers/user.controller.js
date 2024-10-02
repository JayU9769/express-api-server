"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserController", {
    enumerable: true,
    get: function() {
        return UserController;
    }
});
const _typedi = require("typedi");
const _userservice = require("../services/user.service");
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
let UserController = class UserController {
    constructor(){
        _define_property(this, "user", _typedi.Container.get(_userservice.UserService));
        _define_property(this, "getUsers", async (req, res, next)=>{
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
                const findAllUsersData = await this.user.findAllPaginate(options);
                res.status(200).json({
                    data: findAllUsersData,
                    message: 'findAll'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getUserById", async (req, res, next)=>{
            try {
                const userId = req.params.id;
                const findOneUserData = await this.user.findById(userId);
                res.status(200).json({
                    data: findOneUserData,
                    message: 'findOne'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "createUser", async (req, res, next)=>{
            try {
                const userData = req.body;
                const createUserData = await this.user.create(userData);
                res.status(201).json({
                    data: createUserData,
                    message: 'created'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateUser", async (req, res, next)=>{
            try {
                const userId = req.params.id;
                const userData = req.body;
                const updateUserData = await this.user.update(userId, userData);
                res.status(200).json({
                    data: updateUserData,
                    message: 'updated'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "deleteUser", async (req, res, next)=>{
            try {
                const userIds = req.body.ids;
                await this.user.delete(userIds);
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
                await this.user.updateAction({
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
        _define_property(this, "updateAdminPassword", async (req, res, next)=>{
            try {
                const { newPassword, confirmNewPassword } = req.body;
                const userId = req.params.id;
                if (newPassword !== confirmNewPassword) {
                    throw new _HttpException.HttpException(422, 'New password and confirm password do not match');
                }
                await this.user.updatePasswordWithoutCurrent(userId, newPassword);
                res.status(200).json({
                    message: 'Password updated successfully'
                });
            } catch (error) {
                next(error);
            }
        });
    }
};

//# sourceMappingURL=user.controller.js.map