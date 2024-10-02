import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to check if user has a specific role.
 */
export declare function requireRole(roleName: string): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
/**
 * Middleware to check if user has a specific permission.
 */
export declare function requirePermission(permissionName: string): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
