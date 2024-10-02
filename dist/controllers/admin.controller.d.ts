import { NextFunction, Request, Response } from 'express';
import { AdminService } from '@/services/admin.service';
import RolePermissionService from '@/role-permissions/RolePermissionService';
import { PermissionService } from '@/services/permission.service';
/**
 * Controller handling admin-related HTTP requests.
 */
export declare class AdminController {
    admin: AdminService;
    rolePermissionService: RolePermissionService;
    permissionService: PermissionService;
    /**
     * @description Handles admin login functionality using Passport's local strategy.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next function to pass control to the next middleware.
     * @returns A JSON response with a success message and admin data or an error.
     */
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * @description Logs out the currently authenticated admin and clears the session cookie.
     * @param req - Express request object.
     * @param res - Express response object.
     * @returns A JSON response indicating successful logout or an error message.
     */
    logout: (req: Request, res: Response) => Promise<void>;
    /**
     * @description Retrieves the profile of the currently authenticated admin.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next function to pass control to the next middleware.
     * @returns A JSON response with the admins profile data or an error message.
     */
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    /**
     * @description Updates the profile details of the currently authenticated admin.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next function to pass control to the next middleware.
     * @returns A JSON response with the updated admin data or an error message.
     */
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * @description Updates the password of the currently authenticated admin.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next function to pass control to the next middleware.
     * @returns A JSON response indicating successful password update or an error message.
     */
    updatePassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Retrieves a paginated list of admins based on query parameters.
     * Supports pagination, filtering, sorting, and search.
     * @method get
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function for error handling
     */
    getAdmins: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Retrieves a single admin by their ID.
     * @method get
     * @param req Express request object with admin ID in params
     * @param res Express response object
     * @param next Express next function for error handling
     */
    getAdminById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Creates a new admin with provided data.
     * @method post
     * @param req Express request object with admin data in body
     * @param res Express response object
     * @param next Express next function for error handling
     */
    createAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Updates an existing admin with provided data.
     * @method put
     * @param req Express request object with admin ID in params and admin data in body
     * @param res Express response object
     * @param next Express next function for error handling
     */
    updateAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Deletes a admin by their ID.
     * @method delete
     * @param req Express request object with admin ID in params
     * @param res Express response object
     * @param next Express next function for error handling
     */
    deleteAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Single action a admins by their ID & Type.
     * @method post
     * @param req Express request object with admin ID in params
     * @param res Express response object
     * @param next Express next function for error handling
     */
    updateAction: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateAdminPassword: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
}
