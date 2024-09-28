import { Router } from 'express';
import { Routes } from '@/interfaces/route.interface';
import { isAuthenticated } from '@/middlewares/auth.middleware';
import {PermissionController} from "@/controllers/permission.controller";
import {ValidationMiddleware} from "@/middlewares/validation.middleware";
import {UpdatePermissionRequestDto} from "@/dtos/permission.dto";

/**
 * PermissionRoute class handles the routing for permission-related API endpoints.
 * It initializes routes for CRUD operations and bulk actions on permissions.
 */
export class PermissionRoute implements Routes {
  public path = '/permissions'; // Base path for all permission-related routes
  public router = Router(); // Express router instance to define routes
  public permission = new PermissionController(); // Controller to handle permission business logic

  constructor() {
    // Initialize the routes when the PermissionRoute class is instantiated
    this.initializeRoutes();
  }

  /**
   * Initializes all routes for permissions.
   * Includes endpoints for creating, updating, deleting, and fetching permissions,
   * as well as handling bulk update actions.
   */
  private initializeRoutes() {
    // Route to get all permissions with optional pagination, sorting, and filtering
    this.router.get(`${this.path}`, isAuthenticated, this.permission.getPermissions);
    this.router.post(`${this.path}/update-permission`, isAuthenticated, ValidationMiddleware(UpdatePermissionRequestDto), this.permission.updatePermission);
  }
}
