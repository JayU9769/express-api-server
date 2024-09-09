import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RoleService } from '@/services/role.service';
import { IDataTable, IFindAllPaginateOptions } from '@/interfaces/datatable.interface';
import { IUpdateAction, TSortType } from '@/interfaces/global.interface';
import { Role } from '@prisma/client';

/**
 * Controller handling role-related HTTP requests.
 */
export class RoleController {
  public role = Container.get(RoleService);

  /**
   * Retrieves a paginated list of roles based on query parameters.
   * Supports pagination, filtering, sorting, and search.
   * @method get
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public getRoles = async (req: Request, res: Response, next: NextFunction) => {
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

      // Fetch paginated role data
      const findAllRolesData: IDataTable<Role> = await this.role.findAllPaginate(options);

      // Respond with the fetched data
      res.status(200).json({ data: findAllRolesData, message: 'findAll' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Retrieves a single role by its ID.
   * @method get
   * @param req Express request object with role ID in params
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public getRoleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId: string = req.params.id;
      // Find role by ID
      const findOneRoleData: Role = await this.role.findById(roleId);

      // Respond with the fetched role data
      res.status(200).json({ data: findOneRoleData, message: 'findOne' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Creates a new role with provided data.
   * @method post
   * @param req Express request object with role data in body
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleData: Role = req.body;
      // Create new role
      const createRoleData: Role = await this.role.create(roleData);

      // Respond with the created role data
      res.status(201).json({ data: createRoleData, message: 'created' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Updates an existing role with provided data.
   * @method put
   * @param req Express request object with role ID in params and role data in body
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId: string = req.params.id;
      const roleData: Role = req.body;
      // Update role by ID
      const updateRoleData: Role = await this.role.update(roleId, roleData);

      // Respond with the updated role data
      res.status(200).json({ data: updateRoleData, message: 'updated' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Deletes a role by its ID.
   * @method delete
   * @param req Express request object with role ID in params
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleIds: string[] = req.body.ids;
      // Delete role by ID
      await this.role.delete(roleIds);

      // Respond with success message
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Single action a role by its ID & Type.
   * @method post
   * @param req Express request object with role ID in params
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public updateAction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids, field }: IUpdateAction = req.body;

      await this.role.updateAction({ ids, field });

      // Respond with success message
      res.status(200).json({ message: 'Updated Bulk Action' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };
}
