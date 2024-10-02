"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserRoute", {
    enumerable: true,
    get: function() {
        return UserRoute;
    }
});
const _express = require("express");
const _usercontroller = require("../controllers/user.controller");
const _userdto = require("../dtos/user.dto");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _globaldto = require("../dtos/global.dto");
const _authmiddleware = require("../middlewares/auth.middleware");
const _admindto = require("../dtos/admin.dto");
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
let UserRoute = class UserRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('user-view'), this.user.getUsers);
        this.router.get(`${this.path}/:id`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('user-view'), this.user.getUserById);
        this.router.post(`${this.path}`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('user-create'), (0, _validationmiddleware.ValidationMiddleware)(_userdto.CreateUserDto), this.user.createUser);
        this.router.put(`${this.path}/:id`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('user-update'), (0, _validationmiddleware.ValidationMiddleware)(_userdto.UpdateUserDto, false, true), this.user.updateUser);
        this.router.delete(`${this.path}`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('user-delete'), (0, _validationmiddleware.ValidationMiddleware)(_globaldto.DeleteActionDto), this.user.deleteUser);
        this.router.post(`${this.path}/update-action`, _authmiddleware.isAuthenticated, (0, _checkPermissionmiddleware.default)('user-update'), (0, _validationmiddleware.ValidationMiddleware)(_globaldto.UpdateActionDto), this.user.updateAction);
        this.router.patch(`${this.path}/change-password/:id`, _authmiddleware.isAuthenticated, (0, _validationmiddleware.ValidationMiddleware)(_admindto.UpdateAdminPasswordDto, false, true), this.user.updateAdminPassword);
    }
    constructor(){
        _define_property(this, "path", '/users');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "user", new _usercontroller.UserController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=user.route.js.map