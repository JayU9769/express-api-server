"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isAuthenticated", {
    enumerable: true,
    get: function() {
        return isAuthenticated;
    }
});
const isAuthenticated = (req, res, next)=>{
    if (req.isAuthenticated()) {
        return next();
    }
    res.clearCookie('connect.sid');
    return res.status(401).json({
        message: 'Unauthenticated'
    });
};

//# sourceMappingURL=auth.middleware.js.map