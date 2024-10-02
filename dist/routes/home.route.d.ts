import { Routes } from '@/interfaces/route.interface';
import { HomeController } from '@/controllers/home.controller';
export declare class HomeRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    home: HomeController;
    constructor();
    private initializeRoutes;
}
