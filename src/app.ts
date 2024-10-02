import 'reflect-metadata';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import hpp from 'hpp';
import path from 'path';
import { CREDENTIALS, NODE_ENV, ORIGIN, PORT } from '@/config';
import { Routes } from '@/interfaces/route.interface';
import { ErrorMiddleware } from '@/middlewares/error.middleware';
import { passport, PassportService } from '@/config/passport';
import { SessionService } from '@/config/session';
import { RedisService } from '@/config/redis';

/**
 * @class App
 * @description Main class for setting up and running the Express application.
 */
export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  /**
   * @constructor
   * @param {Routes[]} routes - Array of route objects to initialize.
   * Initializes the Express application with routes, middleware, and error handling.
   */
  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development'; // Environment (default to 'development')
    this.port = PORT || 3000; // Application port (default to 3000)

    this.initializeMiddlewares(); // Initialize application middlewares
    this.initializeRoutes(routes); // Initialize application routes
    this.initializeErrorHandling(); // Set up error handling middleware
    this.initializeServices(); // Initialize services
  }

  /**
   * @method listen
   * @description Starts the Express application server on the specified port.
   */
  public async listen() {
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
  private initializeMiddlewares() {
    // Enable CORS with specified origin and credentials
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));

    // Parse incoming JSON requests
    this.app.use(express.json());

    // Parse cookies from the request headers
    this.app.use(cookieParser());

    // Initialize sessions before Passport
    this.app.use(new SessionService().initialize());

    // Initialize Passport for authentication and session management
    this.app.use(passport.initialize()); // Initialize passport
    this.app.use(passport.session()); // Attach the session handling for passport

    // Protection against HTTP parameter pollution attacks
    this.app.use(hpp());

    // Enable response compression to reduce payload sizes
    this.app.use(compression());

    // Serve static files from the 'public' directory
    this.app.use(express.static(path.join(__dirname, '..', 'public')));

    // Parse URL-encoded form data
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * @method initializeRoutes
   * @param {Routes[]} routes - Array of route objects to initialize.
   * @description Loops through all route objects and adds them to the Express application.
   */
  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      // Attach each route's router to the base path '/'
      this.app.use('/', route.router);
    });
  }

  /**
   * @method initializeErrorHandling
   * @description Initializes the error handling middleware for catching and processing errors.
   */
  private initializeErrorHandling() {
    // Use the custom error middleware to handle all application errors
    this.app.use(ErrorMiddleware);
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
  private initializeServices() {
    // Initialize the Redis service. The RedisService is a singleton, so this
    // ensures that only one instance is created and used throughout the application.
    RedisService.getInstance(); // Initializes Redis service

    // Initialize the Passport service. The PassportService is also a singleton,
    // ensuring that all Passport strategies and configurations are set up properly.
    PassportService.getInstance(); // Initializes Passport strategies
  }
}
