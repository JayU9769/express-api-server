"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const tslib_1 = require("tslib");
const express_session_1 = tslib_1.__importDefault(require("express-session"));
const connect_redis_1 = tslib_1.__importDefault(require("connect-redis"));
const index_1 = require("@/config/index");
const redis_1 = require("@/config/redis");
/**
 * A service class to manage session middleware with Redis store.
 * It handles the configuration of the session middleware and ensures Redis connectivity.
 */
class SessionService {
    /**
     * Initializes a new instance of the SessionService class.
     * Uses the singleton RedisService instance to manage Redis connections.
     */
    constructor() {
        this.redisService = redis_1.RedisService.getInstance(); // Get the singleton instance of RedisService
    }
    /**
     * Initializes and configures session middleware with Redis store.
     * @returns A promise that resolves to the session middleware configuration.
     */
    initialize() {
        // Return the configured session middleware
        return (0, express_session_1.default)({
            store: new connect_redis_1.default({
                client: this.redisService.client, // Use the Redis client from RedisService
            }),
            secret: index_1.SECRET_KEY || 'defaultSecret', // Fallback to a default secret if not provided
            resave: false, // Avoid resaving sessions if they are not modified
            saveUninitialized: false, // Only save sessions that are initialized
            cookie: {
                httpOnly: true, // Prevent client-side scripts from accessing the cookie
                secure: index_1.NODE_ENV === 'production', // Use secure cookies only in production
                maxAge: 1000 * 60 * 60 * 24, // Set cookie expiration to 1 day
            },
        });
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=session.js.map