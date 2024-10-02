"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const tslib_1 = require("tslib");
const express_1 = require("express");
const validation_middleware_1 = require("@/middlewares/validation.middleware");
const admin_dto_1 = require("@/dtos/admin.dto");
const admin_controller_1 = require("@/controllers/admin.controller");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const global_dto_1 = require("@/dtos/global.dto");
const checkPermission_middleware_1 = tslib_1.__importDefault(require("@/middlewares/checkPermission.middleware"));
class AdminRoute {
    constructor() {
        this.path = '/admins';
        this.router = (0, express_1.Router)();
        this.admin = new admin_controller_1.AdminController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/login`, (0, validation_middleware_1.ValidationMiddleware)(admin_dto_1.LoginAdminDto), this.admin.login);
        // Profile route - Requires authentication
        this.router.get(`${this.path}/profile`, auth_middleware_1.isAuthenticated, this.admin.getProfile);
        // Logout route
        this.router.post(`${this.path}/logout`, auth_middleware_1.isAuthenticated, this.admin.logout);
        // Update profile route
        this.router.patch(`${this.path}/profile`, auth_middleware_1.isAuthenticated, (0, validation_middleware_1.ValidationMiddleware)(admin_dto_1.UpdateProfileDto), this.admin.updateProfile);
        // Update password route
        this.router.put(`${this.path}/change-password`, auth_middleware_1.isAuthenticated, (0, validation_middleware_1.ValidationMiddleware)(admin_dto_1.UpdatePasswordDto), this.admin.updatePassword);
        // CRUD ROUTES to get all users with optional pagination, sorting, and filtering
        this.router.get(`${this.path}`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('admin-view'), this.admin.getAdmins);
        // Route to get a specific user by their ID
        this.router.get(`${this.path}/:id`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('admin-view'), this.admin.getAdminById);
        // Route to create a new user, with validation for the incoming data
        this.router.post(`${this.path}`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('admin-create'), (0, validation_middleware_1.ValidationMiddleware)(admin_dto_1.CreateAdminDto), this.admin.createAdmin);
        // Route to update an existing user by their ID, with validation for the incoming data
        this.router.put(`${this.path}/:id`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('admin-update'), (0, validation_middleware_1.ValidationMiddleware)(admin_dto_1.UpdateAdminDto, false, true), this.admin.updateAdmin);
        // Route to delete one or more users by their IDs, with validation for the incoming IDs
        this.router.delete(`${this.path}`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('admin-delete'), (0, validation_middleware_1.ValidationMiddleware)(global_dto_1.DeleteActionDto), this.admin.deleteAdmin);
        // Route to update multiple users using a bulk action, with validation for the action data
        this.router.post(`${this.path}/update-action`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('admin-update'), (0, validation_middleware_1.ValidationMiddleware)(global_dto_1.UpdateActionDto), this.admin.updateAction);
        // Route to update selected user password
        this.router.patch(`${this.path}/change-password/:id`, auth_middleware_1.isAuthenticated, (0, validation_middleware_1.ValidationMiddleware)(admin_dto_1.UpdateAdminPasswordDto, false, true), this.admin.updateAdminPassword);
    }
}
exports.AdminRoute = AdminRoute;
//# sourceMappingURL=admin.route.js.map