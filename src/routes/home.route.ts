import { Router } from 'express';
import { Routes } from '@/interfaces/route.interface';
import { HomeController } from '@/controllers/home.controller';
import { isAuthenticated } from '@/middlewares/auth.middleware';

export class HomeRoute implements Routes {
  public path = '/';
  public router = Router();

  public home = new HomeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, async (_, res) => {
      res.status(200).send({ message: 'Welcome back!' });
    });

    this.router.get(`${this.path}search-list`, isAuthenticated, this.home.searchList);
    this.router.get(`${this.path}search-value`, isAuthenticated, this.home.searchValue);
  }
}
