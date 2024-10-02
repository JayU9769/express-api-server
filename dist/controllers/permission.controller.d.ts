import { NextFunction, Request, Response } from 'express';
import { RoleService } from '@/services/role.service';
import { PermissionService } from '@/services/permission.service';
/**
 * Controller handling permission-related HTTP requests.
 */
export declare class PermissionController {
    role: RoleService;
    permission: PermissionService;
    /**
     * Retrieves a paginated list of permissions based on query parameters.
     * Supports pagination, filtering, sorting, and search.
     * @method get
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function for error handling
     */
    getPermissions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updatePermission: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
