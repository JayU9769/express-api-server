"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    requirePermission: function() {
        return requirePermission;
    },
    requireRole: function() {
        return requireRole;
    }
});
const _RolePermissionService = /*#__PURE__*/ _interop_require_default(require("./RolePermissionService"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const rolePermissionService = new _RolePermissionService.default();
function requireRole(roleName) {
    return async (req, res, next)=>{
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const hasRole = await rolePermissionService.hasRole(user.id, roleName, 'user');
        if (!hasRole) {
            return res.status(403).json({
                message: 'Forbidden: Role required'
            });
        }
        next();
    };
}
function requirePermission(permissionName) {
    return async (req, res, next)=>{
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const hasPermission = await rolePermissionService.hasPermission(user.id, permissionName, 'user');
        if (!hasPermission) {
            return res.status(403).json({
                message: 'Forbidden: Permission required'
            });
        }
        next();
    };
}

//# sourceMappingURL=authMiddleware.js.map