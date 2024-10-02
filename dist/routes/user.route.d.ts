import { UserController } from '@/controllers/user.controller';
import { Routes } from '@/interfaces/route.interface';
/**
 * UserRoute class handles the routing for user-related API endpoints.
 * It initializes routes for CRUD operations and bulk actions on users.
 */
export declare class UserRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    user: UserController;
    constructor();
    /**
     * Initializes all routes for users.
     * Includes endpoints for creating, updating, deleting, and fetching users,
     * as well as handling bulk update actions.
     */
    private initializeRoutes;
}
