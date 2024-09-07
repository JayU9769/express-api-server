import { Router } from 'express';
import { Routes } from '@/interfaces/route.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { LoginAdminDto } from '@/dtos/admin.dto';
import { AdminController } from '@/controllers/admin.controller';
import { isAuthenticated } from '@/middlewares/auth.middleware';

export class AdminRoute implements Routes {
  public path = '/admins';
  public router = Router();
  public admin = new AdminController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, ValidationMiddleware(LoginAdminDto), this.admin.login);

    // Profile route - Requires authentication
    this.router.get(`${this.path}/profile`, isAuthenticated, this.admin.getProfile);

    // Logout route
    this.router.post(`${this.path}/logout`, isAuthenticated, this.admin.logout);
  }
}
