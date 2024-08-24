import 'reflect-metadata';
import 'tsconfig-paths/register';
import { App } from '@/app';
import { ValidateEnv } from '@/utils/validateEnv';
import {HomeRoute} from "@/routes/home.route";

ValidateEnv();

const app = new App([new HomeRoute()]);

app.listen();
