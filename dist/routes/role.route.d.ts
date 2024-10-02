import { RoleController } from '@/controllers/role.controller';
import { Routes } from '@/interfaces/route.interface';
/**
 * RoleRoute class handles the routing for role-related API endpoints.
 * It initializes routes for CRUD operations and bulk actions on roles.
 */
export declare class RoleRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    role: RoleController;
    constructor();
    /**
     * Initializes all routes for roles.
     * Includes endpoints for creating, updating, deleting, and fetching roles,
     * as well as handling bulk update actions.
     */
    private initializeRoutes;
}
