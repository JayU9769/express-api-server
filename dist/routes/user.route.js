"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const tslib_1 = require("tslib");
const express_1 = require("express");
const user_controller_1 = require("@/controllers/user.controller");
const user_dto_1 = require("@/dtos/user.dto");
const validation_middleware_1 = require("@/middlewares/validation.middleware");
const global_dto_1 = require("@/dtos/global.dto");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const admin_dto_1 = require("@/dtos/admin.dto");
const checkPermission_middleware_1 = tslib_1.__importDefault(require("@/middlewares/checkPermission.middleware"));
/**
 * UserRoute class handles the routing for user-related API endpoints.
 * It initializes routes for CRUD operations and bulk actions on users.
 */
class UserRoute {
    constructor() {
        this.path = '/users'; // Base path for all user-related routes
        this.router = (0, express_1.Router)(); // Express router instance to define routes
        this.user = new user_controller_1.UserController(); // Controller to handle user business logic
        // Initialize the routes when the UserRoute class is instantiated
        this.initializeRoutes();
    }
    /**
     * Initializes all routes for users.
     * Includes endpoints for creating, updating, deleting, and fetching users,
     * as well as handling bulk update actions.
     */
    initializeRoutes() {
        // Route to get all users with optional pagination, sorting, and filtering
        this.router.get(`${this.path}`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('user-view'), this.user.getUsers);
        // Route to get a specific user by their ID
        this.router.get(`${this.path}/:id`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('user-view'), this.user.getUserById);
        // Route to create a new user, with validation for the incoming data
        this.router.post(`${this.path}`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('user-create'), (0, validation_middleware_1.ValidationMiddleware)(user_dto_1.CreateUserDto), this.user.createUser);
        // Route to update an existing user by their ID, with validation for the incoming data
        this.router.put(`${this.path}/:id`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('user-update'), (0, validation_middleware_1.ValidationMiddleware)(user_dto_1.UpdateUserDto, false, true), this.user.updateUser);
        // Route to delete one or more users by their IDs, with validation for the incoming IDs
        this.router.delete(`${this.path}`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('user-delete'), (0, validation_middleware_1.ValidationMiddleware)(global_dto_1.DeleteActionDto), this.user.deleteUser);
        // Route to update multiple users using a bulk action, with validation for the action data
        this.router.post(`${this.path}/update-action`, auth_middleware_1.isAuthenticated, (0, checkPermission_middleware_1.default)('user-update'), (0, validation_middleware_1.ValidationMiddleware)(global_dto_1.UpdateActionDto), this.user.updateAction);
        // Route to update selected user password
        this.router.patch(`${this.path}/change-password/:id`, auth_middleware_1.isAuthenticated, (0, validation_middleware_1.ValidationMiddleware)(admin_dto_1.UpdateAdminPasswordDto, false, true), this.user.updateAdminPassword);
    }
}
exports.UserRoute = UserRoute;
//# sourceMappingURL=user.route.js.map