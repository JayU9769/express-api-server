import { Request, Response, NextFunction } from 'express';
import RolePermissionService from './RolePermissionService';
import { Admin, User } from '@prisma/client';
import { IAuthUser } from '@/interfaces/global.interface';

const rolePermissionService = new RolePermissionService();

/**
 * Middleware to check if user has a specific role.
 */
export function requireRole(roleName: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IAuthUser; // Assuming req.user has user information
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hasRole = await rolePermissionService.hasRole(user.id, roleName, 'user');
    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: Role required' });
    }

    next();
  };
}

/**
 * Middleware to check if user has a specific permission.
 */
export function requirePermission(permissionName: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as Admin | User; // Assuming req.user has user information
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hasPermission = await rolePermissionService.hasPermission(user.id, permissionName, 'user');
    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden: Permission required' });
    }

    next();
  };
}
