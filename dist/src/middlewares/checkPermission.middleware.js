"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _HttpException = require("../exceptions/HttpException");
const checkPermission = (requiredPermission)=>{
    return (req, res, next)=>{
        const user = req.user;
        if (!user) {
            return next(new _HttpException.HttpException(401, 'User not authenticated.'));
        }
        if (!user.permissions || !Array.isArray(user.permissions)) {
            return next(new _HttpException.HttpException(403, 'Access denied. No permissions found.'));
        }
        const userPermissions = user.permissions;
        if (userPermissions.includes(requiredPermission)) {
            return next();
        }
        return next(new _HttpException.HttpException(403, `Access denied. You do not have the required permission: ${requiredPermission}`));
    };
};
const _default = checkPermission;

//# sourceMappingURL=checkPermission.middleware.js.map