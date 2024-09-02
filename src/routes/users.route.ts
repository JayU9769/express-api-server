import { Router } from 'express';
import { UserController } from '@/controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '@/dtos/users.dto';
import { Routes } from '@/interfaces/routes.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import {DeleteActionDto, UpdateActionDto} from '@/dtos/global.dto';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.user.getUsers);
    this.router.get(`${this.path}/:id`, this.user.getUserById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateUserDto), this.user.createUser);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(UpdateUserDto, false, true), this.user.updateUser);
    this.router.delete(`${this.path}`,ValidationMiddleware(DeleteActionDto), this.user.deleteUser);
    this.router.post(`${this.path}/update-action`, ValidationMiddleware(UpdateActionDto), this.user.updateAction);
  }
}
