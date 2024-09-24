import { Router } from 'express';
import { Routes } from '@/interfaces/route.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { CreateAdminDto, LoginAdminDto, UpdateAdminDto, UpdateAdminPasswordDto, UpdatePasswordDto, UpdateProfileDto } from '@/dtos/admin.dto';
import { AdminController } from '@/controllers/admin.controller';
import { isAuthenticated } from '@/middlewares/auth.middleware';
import { DeleteActionDto, UpdateActionDto } from '@/dtos/global.dto';

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

    // Update profile route
    this.router.patch(`${this.path}/profile`, isAuthenticated, ValidationMiddleware(UpdateProfileDto), this.admin.updateProfile);

    // Update password route
    this.router.put(`${this.path}/change-password`, isAuthenticated, ValidationMiddleware(UpdatePasswordDto), this.admin.updatePassword);

    // CRUD ROUTES
    // Route to get all users with optional pagination, sorting, and filtering
    this.router.get(`${this.path}`, isAuthenticated, this.admin.getAdmins);

    // Route to get a specific user by their ID
    this.router.get(`${this.path}/:id`, isAuthenticated, this.admin.getAdminById);

    // Route to create a new user, with validation for the incoming data
    this.router.post(`${this.path}`, isAuthenticated, ValidationMiddleware(CreateAdminDto), this.admin.createAdmin);

    // Route to update an existing user by their ID, with validation for the incoming data
    this.router.put(`${this.path}/:id`, isAuthenticated, ValidationMiddleware(UpdateAdminDto, false, true), this.admin.updateAdmin);

    // Route to delete one or more users by their IDs, with validation for the incoming IDs
    this.router.delete(`${this.path}`, isAuthenticated, ValidationMiddleware(DeleteActionDto), this.admin.deleteAdmin);

    // Route to update multiple users using a bulk action, with validation for the action data
    this.router.post(`${this.path}/update-action`, isAuthenticated, ValidationMiddleware(UpdateActionDto), this.admin.updateAction);

    // Route to update selected user password
    this.router.patch(
      `${this.path}/change-password/:id`,
      isAuthenticated,
      ValidationMiddleware(UpdateAdminPasswordDto, false, true),
      this.admin.updateAdminPassword,
    );
  }
}
