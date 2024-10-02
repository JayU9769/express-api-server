"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRoute = void 0;
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const permission_controller_1 = require("@/controllers/permission.controller");
const validation_middleware_1 = require("@/middlewares/validation.middleware");
const permission_dto_1 = require("@/dtos/permission.dto");
const checkPermission_middleware_1 = tslib_1.__importDefault(require("@/middlewares/checkPermission.middleware"));
/**
 * PermissionRoute class handles the routing for permission-related API endpoints.
 * It initializes routes for CRUD operations and bulk actions on permissions.
 */
class PermissionRoute {
    constructor() {
        this.path = '/permissions'; // Base path for all permission-related routes
        this.router = (0, express_1.Router)(); // Express router instance to define routes
        this.permission = new permission_controller_1.PermissionController(); // Controller to handle permission business logic
        // Initialize the routes when the PermissionRoute class is instantiated
        this.initializeRoutes();
    }
    /**
     * Initializes all routes for permissions.
     * Includes endpoints for creating, updating, deleting, and fetching permissions,
     * as well as handling bulk update actions.
     */
    initializeRoutes() {
        // Route to get all permissions with optional pagination, sorting, and filtering
        this.router.get(`${this.path}`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('admin-permission'), this.permission.getPermissions);
        this.router.post(`${this.path}/update-permission`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('admin-permission'), (0, validation_middleware_1.ValidationMiddleware)(permission_dto_1.UpdatePermissionRequestDto), this.permission.updatePermission);
    }
}
exports.PermissionRoute = PermissionRoute;
//# sourceMappingURL=permission.route.js.map