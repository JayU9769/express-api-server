/**
 * A service class to manage session middleware with Redis store.
 * It handles the configuration of the session middleware and ensures Redis connectivity.
 */
export declare class SessionService {
    private redisService;
    /**
     * Initializes a new instance of the SessionService class.
     * Uses the singleton RedisService instance to manage Redis connections.
     */
    constructor();
    /**
     * Initializes and configures session middleware with Redis store.
     * @returns A promise that resolves to the session middleware configuration.
     */
    initialize(): import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
