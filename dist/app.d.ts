import 'reflect-metadata';
import express from 'express';
import { Routes } from '@/interfaces/route.interface';
/**
 * @class App
 * @description Main class for setting up and running the Express application.
 */
export declare class App {
    app: express.Application;
    env: string;
    port: string | number;
    /**
     * @constructor
     * @param {Routes[]} routes - Array of route objects to initialize.
     * Initializes the Express application with routes, middleware, and error handling.
     */
    constructor(routes: Routes[]);
    /**
     * @method listen
     * @description Starts the Express application server on the specified port.
     */
    listen(): Promise<void>;
    /**
     * @method initializeMiddlewares
     * @description Sets up all middlewares required for the application.
     * This includes CORS, session handling, Passport initialization, and more.
     */
    private initializeMiddlewares;
    /**
     * @method initializeRoutes
     * @param {Routes[]} routes - Array of route objects to initialize.
     * @description Loops through all route objects and adds them to the Express application.
     */
    private initializeRoutes;
    /**
     * @method initializeErrorHandling
     * @description Initializes the error handling middleware for catching and processing errors.
     */
    private initializeErrorHandling;
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
    private initializeServices;
}
