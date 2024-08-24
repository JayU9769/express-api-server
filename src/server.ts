import 'reflect-metadata';
import 'tsconfig-paths/register';
import { App } from '@/app';
import { ValidateEnv } from '@/utils/validateEnv';
import {HomeRoute} from "@/routes/home.route";
import {UserRoute} from "@/routes/users.route";

ValidateEnv();

const app = new App([new HomeRoute(), new UserRoute()]);

app.listen();
