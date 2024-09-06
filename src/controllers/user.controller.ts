import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from 'prisma';
import { UserService } from '@/services/user.service';
import { IDataTable, IFindAllPaginateOptions } from '@/interfaces/datatable.interface';
import { IUpdateAction, TSortType } from '@/interfaces/global.interface';

/**
 * Controller handling user-related HTTP requests.
 */
export class UserController {
  public user = Container.get(UserService);

  /**
   * Retrieves a paginated list of users based on query parameters.
   * Supports pagination, filtering, sorting, and search.
   * @method get
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Destructure query parameters with default values
      const { pageNumber = 0, perPage = 10, sort = 'createdAt', order = 'ASC', ...filters } = req.query;

      // Prepare options for pagination and filtering
      const options: IFindAllPaginateOptions = {
        pageNumber: Number(pageNumber) + 1,
        perPage: Number(perPage),
        filters: filters,
        q: req.query.q as string,
        ignoreGlobal: (req.query.ignoreGlobal as string)?.split(',') || [],
        sort: String(sort),
        order: String(order).toUpperCase() as TSortType,
      };

      // Fetch paginated user data
      const findAllUsersData: IDataTable<User> = await this.user.findAllPaginate(options);
      // Respond with the fetched data
      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Retrieves a single user by their ID.
   * @method get
   * @param req Express request object with user ID in params
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      // Find user by ID
      const findOneUserData: User = await this.user.findUserById(Number(userId));

      // Respond with the fetched user data
      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Creates a new user with provided data.
   * @method post
   * @param req Express request object with user data in body
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      // Create new user
      const createUserData: User = await this.user.createUser({ ...userData });

      // Respond with the created user data
      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Updates an existing user with provided data.
   * @method put
   * @param req Express request object with user ID in params and user data in body
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: User = req.body;
      // Update user by ID
      const updateUserData: User = await this.user.updateUser(Number(userId), userData);

      // Respond with the updated user data
      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Deletes a user by their ID.
   * @method delete
   * @param req Express request object with user ID in params
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIds: number[] = req.body.ids;
      // Delete user by ID
      await this.user.deleteUser(userIds);

      // Respond with success message
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Single action a users by their ID & Type.
   * @method post
   * @param req Express request object with user ID in params
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public updateAction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids, field }: IUpdateAction = req.body;

      await this.user.updateAction({ ids, field });

      // Respond with success message
      res.status(200).json({ message: 'Updated Bulk Action' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };
}
