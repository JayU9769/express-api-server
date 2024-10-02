import { NextFunction, Request, Response } from 'express';
import { RoleService } from '@/services/role.service';
/**
 * Controller handling role-related HTTP requests.
 */
export declare class RoleController {
    role: RoleService;
    /**
     * Retrieves a paginated list of roles based on query parameters.
     * Supports pagination, filtering, sorting, and search.
     * @method get
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function for error handling
     */
    getRoles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Retrieves a single role by its ID.
     * @method get
     * @param req Express request object with role ID in params
     * @param res Express response object
     * @param next Express next function for error handling
     */
    getRoleById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Creates a new role with provided data.
     * @method post
     * @param req Express request object with role data in body
     * @param res Express response object
     * @param next Express next function for error handling
     */
    createRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Updates an existing role with provided data.
     * @method put
     * @param req Express request object with role ID in params and role data in body
     * @param res Express response object
     * @param next Express next function for error handling
     */
    updateRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Deletes a role by its ID.
     * @method delete
     * @param req Express request object with role ID in params
     * @param res Express response object
     * @param next Express next function for error handling
     */
    deleteRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Single action a role by its ID & Type.
     * @method post
     * @param req Express request object with role ID in params
     * @param res Express response object
     * @param next Express next function for error handling
     */
    updateAction: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
