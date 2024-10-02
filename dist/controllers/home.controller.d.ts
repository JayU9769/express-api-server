import { NextFunction, Request, Response } from 'express';
/**
 * Controller handling admin-related HTTP requests.
 */
export declare class HomeController {
    private roleService;
    private userService;
    /**
     * @description Handles search list API.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next function to pass control to the next middleware.
     * @returns A JSON response with a success message and admin data or an error.
     */
    searchList: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    /**
     * @description Handles search value API.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next function to pass control to the next middleware.
     * @returns A JSON response with a success message and admin data or an error.
     */
    searchValue: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    /**
     * Retrieves search results based on type and search term.
     * @param type - The type of data to search for (roles or users).
     * @param searchTerm - The search keyword in lowercase.
     * @returns A list of formatted search results.
     */
    private getSearchResults;
    /**
     * Maps the items to the desired structure.
     * @param items - The list of items.
     * @param keys - Object mapping for id and textKey.
     * @returns A mapped list of items.
     */
    private mapList;
    private getSearchValue;
    private mapValue;
}
