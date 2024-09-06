import 'reflect-metadata';
import express from "express";
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {CREDENTIALS, NODE_ENV, ORIGIN, PORT} from "@/config";
import {Routes} from "@/interfaces/route.interface";
import hpp from "hpp";
import path from "path";
import {ErrorMiddleware} from "@/middlewares/error.middleware";
import sequelize from "@/models";
import {initializePassport} from "@/config/passport";


export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;


    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    initializePassport();

  }

  public async listen() {
    this.app.listen(this.port, () => {
      console.info(`=================================`);
      console.info(`======= ENV: ${this.env} =======`);
      console.info(`🚀 App listening on the port ${this.port}`);
      console.info(`=================================`);
    });
  }


  private initializeMiddlewares() {
    this.app.use(cors({origin: ORIGIN, credentials: CREDENTIALS}));
    this.app.use(hpp());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '..', 'public')));
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }

}