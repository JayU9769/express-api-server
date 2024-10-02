"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "App", {
    enumerable: true,
    get: function() {
        return App;
    }
});
require("reflect-metadata");
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _compression = /*#__PURE__*/ _interop_require_default(require("compression"));
const _cookieparser = /*#__PURE__*/ _interop_require_default(require("cookie-parser"));
const _cors = /*#__PURE__*/ _interop_require_default(require("cors"));
const _hpp = /*#__PURE__*/ _interop_require_default(require("hpp"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _config = require("./config");
const _errormiddleware = require("./middlewares/error.middleware");
const _passport = require("./config/passport");
const _session = require("./config/session");
const _redis = require("./config/redis");
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
let App = class App {
    async listen() {
        this.app.listen(this.port, ()=>{
            console.info(`=================================`);
            console.info(`======= ENV: ${this.env} =======`);
            console.info(`🚀 App listening on the port ${this.port}`);
            console.info(`=================================`);
        });
    }
    initializeMiddlewares() {
        this.app.use((0, _cors.default)({
            origin: _config.ORIGIN,
            credentials: _config.CREDENTIALS
        }));
        this.app.use(_express.default.json());
        this.app.use((0, _cookieparser.default)());
        this.app.use(new _session.SessionService().initialize());
        this.app.use(_passport.passport.initialize());
        this.app.use(_passport.passport.session());
        this.app.use((0, _hpp.default)());
        this.app.use((0, _compression.default)());
        this.app.use(_express.default.static(_path.default.join(__dirname, '..', 'public')));
        this.app.use(_express.default.urlencoded({
            extended: true
        }));
    }
    initializeRoutes(routes) {
        routes.forEach((route)=>{
            this.app.use('/', route.router);
        });
    }
    initializeErrorHandling() {
        this.app.use(_errormiddleware.ErrorMiddleware);
    }
    initializeServices() {
        _redis.RedisService.getInstance();
        _passport.PassportService.getInstance();
    }
    constructor(routes){
        _define_property(this, "app", void 0);
        _define_property(this, "env", void 0);
        _define_property(this, "port", void 0);
        this.app = (0, _express.default)();
        this.env = _config.NODE_ENV || 'development';
        this.port = _config.PORT || 3000;
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
        this.initializeServices();
    }
};

//# sourceMappingURL=app.js.map