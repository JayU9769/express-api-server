import {NextFunction, Request, Response} from 'express';
import {Container} from 'typedi';
import {User} from '@/interfaces/users.interface';
import {UserService} from '@/services/users.service';
import {DataTable, FindAllPaginateOptions} from '@/interfaces/datatable.interface';
import {TSortType} from '@/interfaces/global.interface';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        pageNumber = 0,
        perPage = 10,
        sort = 'createdAt',
        order = 'ASC',
        ...filters
      } = req.query;

      const options: FindAllPaginateOptions = {
        pageNumber: Number(pageNumber) + 1,
        perPage: Number(perPage),
        filters: filters,
        q: req.query.q as string,
        ignoreGlobal: (req.query.ignoreGlobal as string)?.split(',') || [],
        sort: String(sort),
        order: String(order).toUpperCase() as TSortType,
      };
      const findAllUsersData: DataTable<User> = await this.user.findAllPaginate(options);

      res.status(200).json({data: findAllUsersData, message: 'findAll'});
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({data: findOneUserData, message: 'findOne'});
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({data: createUserData, message: 'created'});
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: User = req.body;
      const updateUserData: User = await this.user.updateUser(Number(userId), userData);

      res.status(200).json({data: updateUserData, message: 'updated'});
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      await this.user.deleteUser(userId);

      res.status(200).json({message: 'deleted'});
    } catch (error) {
      next(error);
    }
  };
}
