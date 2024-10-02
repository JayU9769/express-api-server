"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PermissionRoute", {
    enumerable: true,
    get: function() {
        return PermissionRoute;
    }
});
const _express = require("express");
const _authmiddleware = require("../middlewares/auth.middleware");
const _permissioncontroller = require("../controllers/permission.controller");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _permissiondto = require("../dtos/permission.dto");
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
let PermissionRoute = class PermissionRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('admin-permission'), this.permission.getPermissions);
        this.router.post(`${this.path}/update-permission`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('admin-permission'), (0, _validationmiddleware.ValidationMiddleware)(_permissiondto.UpdatePermissionRequestDto), this.permission.updatePermission);
    }
    constructor(){
        _define_property(this, "path", '/permissions');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "permission", new _permissioncontroller.PermissionController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=permission.route.js.map