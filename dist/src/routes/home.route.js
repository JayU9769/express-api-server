"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HomeRoute", {
    enumerable: true,
    get: function() {
        return HomeRoute;
    }
});
const _express = require("express");
const _homecontroller = require("../controllers/home.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
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
let HomeRoute = class HomeRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, async (_, res)=>{
            res.status(200).send({
                message: 'Welcome back!'
            });
        });
        this.router.get(`${this.path}search-list`, _authmiddleware.isAuthenticated, this.home.searchList);
        this.router.get(`${this.path}search-value`, _authmiddleware.isAuthenticated, this.home.searchValue);
    }
    constructor(){
        _define_property(this, "path", '/');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "home", new _homecontroller.HomeController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=home.route.js.map