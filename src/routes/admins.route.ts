import { Router } from 'express';
import { Routes } from '@/interfaces/routes.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import {LoginAdminDto} from "@/dtos/admins.dto";
import {AdminController} from "@/controllers/admins.controller";
import {passport} from "@/config/passport";

export class AdminsRoute implements Routes {
  public path = '/admins';
  public router = Router();
  public admin = new AdminController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, ValidationMiddleware(LoginAdminDto), passport.authenticate('admin-local', { session: false }), this.admin.login);
  }
}
