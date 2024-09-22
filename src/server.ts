import 'tsconfig-paths/register'; // Allows TypeScript path aliases (from tsconfig) to work in Node.js
import { App } from '@/app'; // Main application class
import { ValidateEnv } from '@/utils/validateEnv'; // Utility function for validating environment variables
import { HomeRoute } from '@/routes/home.route'; // Route for the home endpoint
import { UserRoute } from '@/routes/user.route'; // Route for user-related endpoints
import { AdminRoute } from '@/routes/admin.route'; // Route for admin-related endpoints
import { RoleRoute } from '@/routes/role.route'; // Route for role-related endpoints

// Validate that required environment variables are set
ValidateEnv();

/**
 * Initialize the Express application with the specified routes.
 * These routes will be used by the application to handle different API endpoints.
 */
const app = new App([
  new HomeRoute(), // Home-related API routes
  new RoleRoute(), // Role-related API routes
  new AdminRoute(), // Admin-related API routes
  new UserRoute(), // User-related API routes
]);

// Start the application and listen on the configured port
app.listen();
