import { Routes } from '@/interfaces/route.interface';
import { PermissionController } from '@/controllers/permission.controller';
/**
 * PermissionRoute class handles the routing for permission-related API endpoints.
 * It initializes routes for CRUD operations and bulk actions on permissions.
 */
export declare class PermissionRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    permission: PermissionController;
    constructor();
    /**
     * Initializes all routes for permissions.
     * Includes endpoints for creating, updating, deleting, and fetching permissions,
     * as well as handling bulk update actions.
     */
    private initializeRoutes;
}
