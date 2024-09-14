import session from 'express-session';
import RedisStore from 'connect-redis';
import { NODE_ENV, SECRET_KEY } from '@/config/index';
import { RedisService } from '@/config/redis';

/**
 * A service class to manage session middleware with Redis store.
 * It handles the configuration of the session middleware and ensures Redis connectivity.
 */
export class SessionService {
  private redisService: RedisService;

  /**
   * Initializes a new instance of the SessionService class.
   * Uses the singleton RedisService instance to manage Redis connections.
   */
  constructor() {
    this.redisService = RedisService.getInstance(); // Get the singleton instance of RedisService
  }

  /**
   * Initializes and configures session middleware with Redis store.
   * @returns A promise that resolves to the session middleware configuration.
   */
  initialize() {

    // Return the configured session middleware
    return session({
      store: new RedisStore({
        client: this.redisService.client, // Use the Redis client from RedisService
      }),
      secret: SECRET_KEY || 'defaultSecret', // Fallback to a default secret if not provided
      resave: false, // Avoid resaving sessions if they are not modified
      saveUninitialized: false, // Only save sessions that are initialized
      cookie: {
        httpOnly: true, // Prevent client-side scripts from accessing the cookie
        secure: NODE_ENV === 'production', // Use secure cookies only in production
        maxAge: 1000 * 60 * 60 * 24, // Set cookie expiration to 1 day
      },
    });
  }
}
