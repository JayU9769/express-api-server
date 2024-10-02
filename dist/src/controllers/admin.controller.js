"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminController", {
    enumerable: true,
    get: function() {
        return AdminController;
    }
});
const _HttpException = require("../exceptions/HttpException");
const _passport = require("../config/passport");
const _typedi = require("typedi");
const _adminservice = require("../services/admin.service");
const _client = require("@prisma/client");
const _RolePermissionService = /*#__PURE__*/ _interop_require_default(require("../role-permissions/RolePermissionService"));
const _permissionservice = require("../services/permission.service");
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
let AdminController = class AdminController {
    constructor(){
        _define_property(this, "admin", _typedi.Container.get(_adminservice.AdminService));
        _define_property(this, "rolePermissionService", _typedi.Container.get(_RolePermissionService.default));
        _define_property(this, "permissionService", _typedi.Container.get(_permissionservice.PermissionService));
        _define_property(this, "login", async (req, res, next)=>{
            _passport.passport.authenticate('admin-local', (e, admin)=>{
                if (e || !admin) {
                    return next(new _HttpException.HttpException(401, 'Invalid credentials'));
                }
                req.login(admin, (loginErr)=>{
                    if (loginErr) {
                        return next(new _HttpException.HttpException(500, 'Login failed'));
                    }
                    return res.status(200).json({
                        message: 'Logged in successfully',
                        data: admin
                    });
                });
            })(req, res, next);
        });
        _define_property(this, "logout", async (req, res)=>{
            req.logout((e)=>{
                if (e) {
                    return res.status(500).json({
                        message: 'Error during logout'
                    });
                }
                res.clearCookie('connect.sid');
                return res.status(200).json({
                    message: 'Logged out successfully'
                });
            });
        });
        _define_property(this, "getProfile", async (req, res, next)=>{
            if (!req.user) {
                return next(new _HttpException.HttpException(401, 'Not authenticated'));
            }
            const admin = req.user;
            const permission = await this.permissionService.getPermissions();
            const mergedPermissions = admin.roles.reduce((acc, role)=>{
                const permissions = permission[_client.UserType.admin][role] || [];
                return [
                    ...acc,
                    ...permissions
                ];
            }, []);
            req.user.permissions = [
                ...new Set(mergedPermissions)
            ];
            req.session.save((err)=>{
                if (err) {
                    return next(err);
                }
            });
            return res.status(200).json({
                message: 'Admin Profile',
                data: req.user
            });
        });
        _define_property(this, "updateProfile", async (req, res, next)=>{
            try {
                const { name, email } = req.body;
                const admin = req.user;
                const updatedAdmin = await this.admin.updateProfile(admin.id, name, email);
                admin.name = updatedAdmin.name;
                admin.email = updatedAdmin.email;
                req.user = admin;
                req.session.save((err)=>{
                    if (err) {
                        return next(err);
                    }
                });
                res.status(200).json({
                    message: 'Profile updated successfully',
                    data: updatedAdmin
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updatePassword", async (req, res, next)=>{
            try {
                const { currentPassword, newPassword } = req.body;
                const adminId = req.user.id;
                await this.admin.updatePassword(adminId, currentPassword, newPassword);
                res.clearCookie('connect.sid');
                res.status(200).json({
                    message: 'Password updated successfully'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getAdmins", async (req, res, next)=>{
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
                const findAllAdminsData = await this.admin.findAllPaginate(options);
                res.status(200).json({
                    data: findAllAdminsData,
                    message: 'findAll'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getAdminById", async (req, res, next)=>{
            try {
                const adminId = req.params.id;
                const findOneAdminData = await this.admin.findById(adminId);
                const roles = await this.rolePermissionService.getRoles(adminId, 'admin');
                res.status(200).json({
                    data: _object_spread_props(_object_spread({}, findOneAdminData), {
                        roles: roles.map((role)=>role.id)
                    }),
                    message: 'findOne'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "createAdmin", async (req, res, next)=>{
            try {
                const _req_body = req.body, { roles } = _req_body, rest = _object_without_properties(_req_body, [
                    "roles"
                ]);
                const adminData = rest;
                const createAdminData = await this.admin.create(adminData);
                if (roles.length > 0) {
                    this.rolePermissionService.syncRoles(createAdminData.id, roles, 'admin');
                }
                res.status(201).json({
                    data: createAdminData,
                    message: 'created'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateAdmin", async (req, res, next)=>{
            try {
                const adminId = req.params.id;
                const _req_body = req.body, { roles } = _req_body, rest = _object_without_properties(_req_body, [
                    "roles"
                ]);
                const adminData = rest;
                const updateAdminData = await this.admin.update(adminId, adminData);
                if (roles.length > 0) {
                    this.rolePermissionService.syncRoles(adminId, roles, 'admin');
                }
                res.status(200).json({
                    data: updateAdminData,
                    message: 'updated'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "deleteAdmin", async (req, res, next)=>{
            try {
                const adminIds = req.body.ids;
                await this.admin.delete(adminIds);
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
                await this.admin.updateAction({
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
                const adminId = req.params.id;
                if (newPassword !== confirmNewPassword) {
                    return res.status(422).json({
                        error: 'New password and confirm password do not match'
                    });
                }
                await this.admin.updatePasswordWithoutCurrent(adminId, newPassword);
                res.status(200).json({
                    message: 'Password updated successfully'
                });
            } catch (error) {
                next(error);
            }
        });
    }
};

//# sourceMappingURL=admin.controller.js.map