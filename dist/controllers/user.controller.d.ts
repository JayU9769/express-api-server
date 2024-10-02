import { NextFunction, Request, Response } from 'express';
import { UserService } from '@/services/user.service';
/**
 * Controller handling user-related HTTP requests.
 */
export declare class UserController {
    user: UserService;
    /**
     * Retrieves a paginated list of users based on query parameters.
     * Supports pagination, filtering, sorting, and search.
     * @method get
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function for error handling
     */
    getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Retrieves a single user by their ID.
     * @method get
     * @param req Express request object with user ID in params
     * @param res Express response object
     * @param next Express next function for error handling
     */
    getUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Creates a new user with provided data.
     * @method post
     * @param req Express request object with user data in body
     * @param res Express response object
     * @param next Express next function for error handling
     */
    createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Updates an existing user with provided data.
     * @method put
     * @param req Express request object with user ID in params and user data in body
     * @param res Express response object
     * @param next Express next function for error handling
     */
    updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Deletes a user by their ID.
     * @method delete
     * @param req Express request object with user ID in params
     * @param res Express response object
     * @param next Express next function for error handling
     */
    deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Single action a users by their ID & Type.
     * @method post
     * @param req Express request object with user ID in params
     * @param res Express response object
     * @param next Express next function for error handling
     */
    updateAction: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateAdminPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
