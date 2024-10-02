import { Routes } from '@/interfaces/route.interface';
import { AdminController } from '@/controllers/admin.controller';
export declare class AdminRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    admin: AdminController;
    constructor();
    private initializeRoutes;
}
