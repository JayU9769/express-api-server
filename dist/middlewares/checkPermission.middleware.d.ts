import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to check if the user has the required permission.
 *
 * @param {string} requiredPermission - The name of the permission to check.
 * @returns {Function} - Express middleware function.
 */
declare const checkPermission: (requiredPermission: string) => (req: Request, res: Response, next: NextFunction) => void;
export default checkPermission;
