"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeRoute = void 0;
const express_1 = require("express");
const home_controller_1 = require("@/controllers/home.controller");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
class HomeRoute {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.home = new home_controller_1.HomeController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, async (_, res) => {
            res.status(200).send({ message: 'Welcome back!' });
        });
        this.router.get(`${this.path}search-list`, auth_middleware_1.isAuthenticated, this.home.searchList);
        this.router.get(`${this.path}search-value`, auth_middleware_1.isAuthenticated, this.home.searchValue);
    }
}
exports.HomeRoute = HomeRoute;
//# sourceMappingURL=home.route.js.map