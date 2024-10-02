"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("@/exceptions/HttpException");
/**
 * Middleware to check if the user has the required permission.
 *
 * @param {string} requiredPermission - The name of the permission to check.
 * @returns {Function} - Express middleware function.
 */
const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        const user = req.user;
        // Check if the user is authenticated and has permissions
        if (!user) {
            // User not authenticated
            return next(new HttpException_1.HttpException(401, 'User not authenticated.'));
        }
        if (!user.permissions || !Array.isArray(user.permissions)) {
            // User has no permissions or permissions are not properly formatted
            return next(new HttpException_1.HttpException(403, 'Access denied. No permissions found.'));
        }
        // Check if the required permission exists in the user's permissions
        const userPermissions = user.permissions;
        if (userPermissions.includes(requiredPermission)) {
            // Permission exists, proceed to the next middleware or route handler
            return next();
        }
        // Permission not found, deny access
        return next(new HttpException_1.HttpException(403, `Access denied. You do not have the required permission: ${requiredPermission}`));
    };
};
exports.default = checkPermission;
//# sourceMappingURL=checkPermission.middleware.js.map