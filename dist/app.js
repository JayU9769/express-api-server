"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const express_1 = tslib_1.__importDefault(require("express"));
const compression_1 = tslib_1.__importDefault(require("compression"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const hpp_1 = tslib_1.__importDefault(require("hpp"));
const path_1 = tslib_1.__importDefault(require("path"));
const config_1 = require("@/config");
const error_middleware_1 = require("@/middlewares/error.middleware");
const passport_1 = require("@/config/passport");
const session_1 = require("@/config/session");
const redis_1 = require("@/config/redis");
/**
 * @class App
 * @description Main class for setting up and running the Express application.
 */
class App {
    /**
     * @constructor
     * @param {Routes[]} routes - Array of route objects to initialize.
     * Initializes the Express application with routes, middleware, and error handling.
     */
    constructor(routes) {
        this.app = (0, express_1.default)();
        this.env = config_1.NODE_ENV || 'development'; // Environment (default to 'development')
        this.port = config_1.PORT || 3000; // Application port (default to 3000)
        this.initializeMiddlewares(); // Initialize application middlewares
        this.initializeRoutes(routes); // Initialize application routes
        this.initializeErrorHandling(); // Set up error handling middleware
        this.initializeServices(); // Initialize services
    }
    /**
     * @method listen
     * @description Starts the Express application server on the specified port.
     */
    async listen() {
        this.app.listen(this.port, () => {
            console.info(`=================================`);
            console.info(`======= ENV: ${this.env} =======`);
            console.info(`🚀 App listening on the port ${this.port}`);
            console.info(`=================================`);
        });
    }
    /**
     * @method initializeMiddlewares
     * @description Sets up all middlewares required for the application.
     * This includes CORS, session handling, Passport initialization, and more.
     */
    initializeMiddlewares() {
        // Enable CORS with specified origin and credentials
        this.app.use((0, cors_1.default)({ origin: config_1.ORIGIN, credentials: config_1.CREDENTIALS }));
        // Parse incoming JSON requests
        this.app.use(express_1.default.json());
        // Parse cookies from the request headers
        this.app.use((0, cookie_parser_1.default)());
        // Initialize sessions before Passport
        this.app.use(new session_1.SessionService().initialize());
        // Initialize Passport for authentication and session management
        this.app.use(passport_1.passport.initialize()); // Initialize passport
        this.app.use(passport_1.passport.session()); // Attach the session handling for passport
        // Protection against HTTP parameter pollution attacks
        this.app.use((0, hpp_1.default)());
        // Enable response compression to reduce payload sizes
        this.app.use((0, compression_1.default)());
        // Serve static files from the 'public' directory
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
        // Parse URL-encoded form data
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    /**
     * @method initializeRoutes
     * @param {Routes[]} routes - Array of route objects to initialize.
     * @description Loops through all route objects and adds them to the Express application.
     */
    initializeRoutes(routes) {
        routes.forEach(route => {
            // Attach each route's router to the base path '/'
            this.app.use('/', route.router);
        });
    }
    /**
     * @method initializeErrorHandling
     * @description Initializes the error handling middleware for catching and processing errors.
     */
    initializeErrorHandling() {
        // Use the custom error middleware to handle all application errors
        this.app.use(error_middleware_1.ErrorMiddleware);
    }
    /**
     * Initializes third-party services required by the application.
     * This method ensures that all necessary services are set up and ready to use.
     * Specifically, it initializes Redis for caching and session management
     * and configures Passport for authentication strategies.
     *
     * @method initializeServices
     * @description Initializes the Redis and Passport services.
     * - `RedisService.getInstance()`: Initializes the Redis service singleton instance.
     * - `PassportService.getInstance()`: Initializes the Passport service singleton instance.
     */
    initializeServices() {
        // Initialize the Redis service. The RedisService is a singleton, so this
        // ensures that only one instance is created and used throughout the application.
        redis_1.RedisService.getInstance(); // Initializes Redis service
        // Initialize the Passport service. The PassportService is also a singleton,
        // ensuring that all Passport strategies and configurations are set up properly.
        passport_1.PassportService.getInstance(); // Initializes Passport strategies
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map