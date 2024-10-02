"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RoleRoute", {
    enumerable: true,
    get: function() {
        return RoleRoute;
    }
});
const _express = require("express");
const _rolecontroller = require("../controllers/role.controller");
const _roledto = require("../dtos/role.dto");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _globaldto = require("../dtos/global.dto");
const _authmiddleware = require("../middlewares/auth.middleware");
const _checkPermissionmiddleware = /*#__PURE__*/ _interop_require_default(require("../middlewares/checkPermission.middleware"));
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
let RoleRoute = class RoleRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('role-view'), this.role.getRoles);
        this.router.get(`${this.path}/:id`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('role-view'), this.role.getRoleById);
        this.router.post(`${this.path}`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('role-create'), (0, _validationmiddleware.ValidationMiddleware)(_roledto.CreateRoleDto), this.role.createRole);
        this.router.put(`${this.path}/:id`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('role-update'), (0, _validationmiddleware.ValidationMiddleware)(_roledto.UpdateRoleDto, false, true), this.role.updateRole);
        this.router.delete(`${this.path}`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('role-delete'), (0, _validationmiddleware.ValidationMiddleware)(_globaldto.DeleteActionDto), this.role.deleteRole);
        this.router.post(`${this.path}/update-action`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('role-update'), (0, _validationmiddleware.ValidationMiddleware)(_globaldto.UpdateActionDto), this.role.updateAction);
    }
    constructor(){
        _define_property(this, "path", '/roles');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "role", new _rolecontroller.RoleController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=role.route.js.map