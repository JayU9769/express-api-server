"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRoute = void 0;
const tslib_1 = require("tslib");
const express_1 = require("express");
const role_controller_1 = require("@/controllers/role.controller");
const role_dto_1 = require("@/dtos/role.dto");
const validation_middleware_1 = require("@/middlewares/validation.middleware");
const global_dto_1 = require("@/dtos/global.dto");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const checkPermission_middleware_1 = tslib_1.__importDefault(require("@/middlewares/checkPermission.middleware"));
/**
 * RoleRoute class handles the routing for role-related API endpoints.
 * It initializes routes for CRUD operations and bulk actions on roles.
 */
class RoleRoute {
    constructor() {
        this.path = '/roles'; // Base path for all role-related routes
        this.router = (0, express_1.Router)(); // Express router instance to define routes
        this.role = new role_controller_1.RoleController(); // Controller to handle role business logic
        // Initialize the routes when the RoleRoute class is instantiated
        this.initializeRoutes();
    }
    /**
     * Initializes all routes for roles.
     * Includes endpoints for creating, updating, deleting, and fetching roles,
     * as well as handling bulk update actions.
     */
    initializeRoutes() {
        // Route to get all roles with optional pagination, sorting, and filtering
        this.router.get(`${this.path}`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('role-view'), this.role.getRoles);
        // Route to get a specific role by its ID
        this.router.get(`${this.path}/:id`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('role-view'), this.role.getRoleById);
        // Route to create a new role, with validation for the incoming data
        this.router.post(`${this.path}`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('role-create'), (0, validation_middleware_1.ValidationMiddleware)(role_dto_1.CreateRoleDto), this.role.createRole);
        // Route to update an existing role by its ID, with validation for the incoming data
        this.router.put(`${this.path}/:id`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('role-update'), (0, validation_middleware_1.ValidationMiddleware)(role_dto_1.UpdateRoleDto, false, true), this.role.updateRole);
        // Route to delete one or more roles by their IDs, with validation for the incoming IDs
        this.router.delete(`${this.path}`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('role-delete'), (0, validation_middleware_1.ValidationMiddleware)(global_dto_1.DeleteActionDto), this.role.deleteRole);
        // Route to update multiple roles using a bulk action, with validation for the action data
        this.router.post(`${this.path}/update-action`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('role-update'), (0, validation_middleware_1.ValidationMiddleware)(global_dto_1.UpdateActionDto), this.role.updateAction);
    }
}
exports.RoleRoute = RoleRoute;
//# sourceMappingURL=role.route.js.map