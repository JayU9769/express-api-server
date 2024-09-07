import { Router } from 'express';
import { RoleController } from '@/controllers/role.controller';
import { CreateRoleDto, UpdateRoleDto } from '@/dtos/role.dto';
import { Routes } from '@/interfaces/route.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import {DeleteActionDto, UpdateActionDto} from '@/dtos/global.dto';

/**
 * RoleRoute class handles the routing for role-related API endpoints.
 * It initializes routes for CRUD operations and bulk actions on roles.
 */
export class RoleRoute implements Routes {
  public path = '/roles'; // Base path for all role-related routes
  public router = Router(); // Express router instance to define routes
  public role = new RoleController(); // Controller to handle role business logic

  constructor() {
    // Initialize the routes when the RoleRoute class is instantiated
    this.initializeRoutes();
  }

  /**
   * Initializes all routes for roles.
   * Includes endpoints for creating, updating, deleting, and fetching roles,
   * as well as handling bulk update actions.
   */
  private initializeRoutes() {
    // Route to get all roles with optional pagination, sorting, and filtering
    this.router.get(`${this.path}`, this.role.getRoles);

    // Route to get a specific role by its ID
    this.router.get(`${this.path}/:id`, this.role.getRoleById);

    // Route to create a new role, with validation for the incoming data
    this.router.post(`${this.path}`, ValidationMiddleware(CreateRoleDto), this.role.createRole);

    // Route to update an existing role by its ID, with validation for the incoming data
    this.router.put(`${this.path}/:id`, ValidationMiddleware(UpdateRoleDto, false, true), this.role.updateRole);

    // Route to delete one or more roles by their IDs, with validation for the incoming IDs
    this.router.delete(`${this.path}`, ValidationMiddleware(DeleteActionDto), this.role.deleteRole);

    // Route to update multiple roles using a bulk action, with validation for the action data
    this.router.post(`${this.path}/update-action`, ValidationMiddleware(UpdateActionDto), this.role.updateAction);
  }
}
