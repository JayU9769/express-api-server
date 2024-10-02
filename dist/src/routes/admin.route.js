"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminRoute", {
    enumerable: true,
    get: function() {
        return AdminRoute;
    }
});
const _express = require("express");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _admindto = require("../dtos/admin.dto");
const _admincontroller = require("../controllers/admin.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
const _globaldto = require("../dtos/global.dto");
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
let AdminRoute = class AdminRoute {
    initializeRoutes() {
        this.router.post(`${this.path}/login`, (0, _validationmiddleware.ValidationMiddleware)(_admindto.LoginAdminDto), this.admin.login);
        this.router.get(`${this.path}/profile`, _authmiddleware.isAuthenticated, this.admin.getProfile);
        this.router.post(`${this.path}/logout`, _authmiddleware.isAuthenticated, this.admin.logout);
        this.router.patch(`${this.path}/profile`, _authmiddleware.isAuthenticated, (0, _validationmiddleware.ValidationMiddleware)(_admindto.UpdateProfileDto), this.admin.updateProfile);
        this.router.put(`${this.path}/change-password`, _authmiddleware.isAuthenticated, (0, _validationmiddleware.ValidationMiddleware)(_admindto.UpdatePasswordDto), this.admin.updatePassword);
        this.router.get(`${this.path}`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('admin-view'), this.admin.getAdmins);
        this.router.get(`${this.path}/:id`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('admin-view'), this.admin.getAdminById);
        this.router.post(`${this.path}`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('admin-create'), (0, _validationmiddleware.ValidationMiddleware)(_admindto.CreateAdminDto), this.admin.createAdmin);
        this.router.put(`${this.path}/:id`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('admin-update'), (0, _validationmiddleware.ValidationMiddleware)(_admindto.UpdateAdminDto, false, true), this.admin.updateAdmin);
        this.router.delete(`${this.path}`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('admin-delete'), (0, _validationmiddleware.ValidationMiddleware)(_globaldto.DeleteActionDto), this.admin.deleteAdmin);
        this.router.post(`${this.path}/update-action`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('admin-update'), (0, _validationmiddleware.ValidationMiddleware)(_globaldto.UpdateActionDto), this.admin.updateAction);
        this.router.patch(`${this.path}/change-password/:id`, _authmiddleware.isAuthenticated, (0, _validationmiddleware.ValidationMiddleware)(_admindto.UpdateAdminPasswordDto, false, true), this.admin.updateAdminPassword);
    }
    constructor(){
        _define_property(this, "path", '/admins');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "admin", new _admincontroller.AdminController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=admin.route.js.map