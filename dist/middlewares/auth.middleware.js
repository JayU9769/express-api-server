"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.clearCookie('connect.sid');
    return res.status(401).json({ message: 'Unauthenticated' });
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=auth.middleware.js.map