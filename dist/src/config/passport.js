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
    PassportService: function() {
        return PassportService;
    },
    passport: function() {
        return _passport.default;
    }
});
const _passport = /*#__PURE__*/ _interop_require_default(require("passport"));
const _passportlocal = require("passport-local");
const _bcryptjs = /*#__PURE__*/ _interop_require_default(require("bcryptjs"));
const _client = require("@prisma/client");
const _HttpException = require("../exceptions/HttpException");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = _object_without_properties_loose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
const prisma = new _client.PrismaClient();
let PassportService = class PassportService {
    static getInstance() {
        if (!PassportService.instance) {
            PassportService.instance = new PassportService();
        }
        return PassportService.instance;
    }
    initialize() {
        _passport.default.use('admin-local', new _passportlocal.Strategy({
            usernameField: 'email'
        }, async (email, password, done)=>{
            try {
                const admin = await prisma.admin.findUnique({
                    where: {
                        email
                    }
                });
                if (!admin) {
                    return done(new _HttpException.HttpException(401, 'No admin with that email'), null);
                }
                if (!admin.status) {
                    return done(new _HttpException.HttpException(401, 'Account has been deactivated!'), null);
                }
                const isMatch = await _bcryptjs.default.compare(password, admin.password);
                if (!isMatch) {
                    return done(new _HttpException.HttpException(401, 'Provided password is invalid'), null);
                }
                const roles = await prisma.modelHasRole.findMany({
                    where: {
                        modelId: admin.id,
                        modelType: _client.UserType.admin
                    },
                    include: {
                        role: {
                            include: {
                                roleHasPermissions: {
                                    include: {
                                        permission: true
                                    }
                                }
                            }
                        }
                    }
                });
                const userRoles = [];
                const permissions = roles.flatMap((userRole)=>{
                    userRoles.push(userRole.role.name);
                    return userRole.role.roleHasPermissions.map((rp)=>rp.permission.name);
                });
                const { password: _ } = admin, rest = _object_without_properties(admin, [
                    "password"
                ]);
                return done(null, _object_spread_props(_object_spread({}, rest), {
                    roles: userRoles,
                    permissions
                }));
            } catch (error) {
                return done(new _HttpException.HttpException(500, 'Internal server error'), null);
            }
        }));
        _passport.default.serializeUser((user, done)=>{
            const { password } = user, rest = _object_without_properties(user, [
                "password"
            ]);
            done(null, rest);
        });
        _passport.default.deserializeUser(async (admin, done)=>{
            try {
                if (admin) {
                    return done(null, admin);
                }
                done(new _HttpException.HttpException(404, 'User not found'), null);
            } catch (error) {
                done(new _HttpException.HttpException(500, 'Internal server error'), null);
            }
        });
    }
    constructor(){
        this.initialize();
    }
};
_define_property(PassportService, "instance", null);

//# sourceMappingURL=passport.js.map