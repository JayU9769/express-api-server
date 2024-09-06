import 'reflect-metadata';
import 'tsconfig-paths/register';
import { App } from '@/app';
import { ValidateEnv } from '@/utils/validateEnv';
import {HomeRoute} from "@/routes/home.route";
import {UserRoute} from "@/routes/user.route";
import {AdminRoute} from "@/routes/admin.route";

ValidateEnv();

const app = new App([
  new AdminRoute(),
  new HomeRoute(),
  new UserRoute()
]);

app.listen();
