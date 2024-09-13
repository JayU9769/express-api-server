import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { CreateUserDto, UpdateUserDto } from '@/dtos/user.dto';
import { Routes } from '@/interfaces/route.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { DeleteActionDto, UpdateActionDto } from '@/dtos/global.dto';
import { isAuthenticated } from '@/middlewares/auth.middleware';

/**
 * UserRoute class handles the routing for user-related API endpoints.
 * It initializes routes for CRUD operations and bulk actions on users.
 */
export class UserRoute implements Routes {
  public path = '/users'; // Base path for all user-related routes
  public router = Router(); // Express router instance to define routes
  public user = new UserController(); // Controller to handle user business logic

  constructor() {
    // Initialize the routes when the UserRoute class is instantiated
    this.initializeRoutes();
  }

  /**
   * Initializes all routes for users.
   * Includes endpoints for creating, updating, deleting, and fetching users,
   * as well as handling bulk update actions.
   */
  private initializeRoutes() {
    // Route to get all users with optional pagination, sorting, and filtering
    this.router.get(`${this.path}`, isAuthenticated, this.user.getUsers);

    // Route to get a specific user by their ID
    this.router.get(`${this.path}/:id`, isAuthenticated, this.user.getUserById);

    // Route to create a new user, with validation for the incoming data
    this.router.post(`${this.path}`, isAuthenticated, ValidationMiddleware(CreateUserDto), this.user.createUser);

    // Route to update an existing user by their ID, with validation for the incoming data
    this.router.put(`${this.path}/:id`, isAuthenticated, ValidationMiddleware(UpdateUserDto, false, true), this.user.updateUser);

    // Route to delete one or more users by their IDs, with validation for the incoming IDs
    this.router.delete(`${this.path}`, isAuthenticated, ValidationMiddleware(DeleteActionDto), this.user.deleteUser);

    // Route to update multiple users using a bulk action, with validation for the action data
    this.router.post(`${this.path}/update-action`, isAuthenticated, ValidationMiddleware(UpdateActionDto), this.user.updateAction);
  }
}
