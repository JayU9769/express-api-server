"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
exports.requirePermission = requirePermission;
const tslib_1 = require("tslib");
const RolePermissionService_1 = tslib_1.__importDefault(require("./RolePermissionService"));
const rolePermissionService = new RolePermissionService_1.default();
/**
 * Middleware to check if user has a specific role.
 */
function requireRole(roleName) {
    return async (req, res, next) => {
        const user = req.user; // Assuming req.user has user information
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const hasRole = await rolePermissionService.hasRole(user.id, roleName, 'user');
        if (!hasRole) {
            return res.status(403).json({ message: 'Forbidden: Role required' });
        }
        next();
    };
}
/**
 * Middleware to check if user has a specific permission.
 */
function requirePermission(permissionName) {
    return async (req, res, next) => {
        const user = req.user; // Assuming req.user has user information
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const hasPermission = await rolePermissionService.hasPermission(user.id, permissionName, 'user');
        if (!hasPermission) {
            return res.status(403).json({ message: 'Forbidden: Permission required' });
        }
        next();
    };
}
//# sourceMappingURL=authMiddleware.js.map