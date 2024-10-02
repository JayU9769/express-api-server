"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); // Enables reflection for decorators and metadata management
require("tsconfig-paths/register"); // Allows TypeScript path aliases (from tsconfig) to work in Node.js
const app_1 = require("@/app"); // Main application class
const validateEnv_1 = require("@/utils/validateEnv"); // Utility function for validating environment variables
const home_route_1 = require("@/routes/home.route"); // Route for the home endpoint
const user_route_1 = require("@/routes/user.route"); // Route for user-related endpoints
const admin_route_1 = require("@/routes/admin.route"); // Route for admin-related endpoints
const role_route_1 = require("@/routes/role.route");
const permission_route_1 = require("@/routes/permission.route"); // Route for role-related endpoints
// Validate that required environment variables are set
(0, validateEnv_1.ValidateEnv)();
/**
 * Initialize the Express application with the specified routes.
 * These routes will be used by the application to handle different API endpoints.
 */
const app = new app_1.App([
    new home_route_1.HomeRoute(), // Home-related API routes
    new role_route_1.RoleRoute(), // Role-related API routes
    new permission_route_1.PermissionRoute(), // Permission-related API routes
    new admin_route_1.AdminRoute(), // Admin-related API routes
    new user_route_1.UserRoute(), // User-related API routes
]);
// Start the application and listen on the configured port
app.listen();
//# sourceMappingURL=server.js.map