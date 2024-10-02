import { Admin, User } from '@prisma/client';
export type TSortType = 'ASC' | 'DESC';
export type TRecord = Record<string, any>;
export declare enum EUserType {
    ADMIN = "admin",
    USER = "user"
}
export interface IUpdateAction {
    ids: Array<string>;
    field: {
        name: string;
        value: number | string;
    };
}
declare global {
    namespace Express {
        interface Request {
            user: User | Admin;
        }
    }
}
export interface IAuthUser extends Admin, User {
    roles: Array<string>;
    permissions: Array<string>;
}
