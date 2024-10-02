"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SessionService", {
    enumerable: true,
    get: function() {
        return SessionService;
    }
});
const _expresssession = /*#__PURE__*/ _interop_require_default(require("express-session"));
const _connectredis = /*#__PURE__*/ _interop_require_default(require("connect-redis"));
const _index = require("./index");
const _redis = require("./redis");
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
let SessionService = class SessionService {
    initialize() {
        return (0, _expresssession.default)({
            store: new _connectredis.default({
                client: this.redisService.client
            }),
            secret: _index.SECRET_KEY || 'defaultSecret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: _index.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24
            }
        });
    }
    constructor(){
        _define_property(this, "redisService", void 0);
        this.redisService = _redis.RedisService.getInstance();
    }
};

//# sourceMappingURL=session.js.map