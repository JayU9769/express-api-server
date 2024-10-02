import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RoleService } from '@/services/role.service';
import { EUserType, IUpdateAction } from '@/interfaces/global.interface';
import { PermissionService } from '@/services/permission.service';
import { HttpException } from '@/exceptions/HttpException';
import { IUpdatePermission } from '@/interfaces/permission.interface';

/**
 * Controller handling permission-related HTTP requests.
 */
export class PermissionController {
  public role = Container.get(RoleService);
  public permission = Container.get(PermissionService);

  /**
   * Retrieves a paginated list of permissions based on query parameters.
   * Supports pagination, filtering, sorting, and search.
   * @method get
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public getPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.query.type;

      if (!type) {
        throw new HttpException(422, 'Type is Required');
      }

      const permissions = await this.permission.findAll(type as EUserType);
      const roleHasPermissions = await this.permission.findAllRoleHasPermissions();
      const roles = await this.role.findAll(type as EUserType);

      // Respond with the fetched data
      res.status(200).json({
        data: {
          permissions,
          roles,
          roleHasPermissions,
        },
        message: 'findAll',
      });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  public updatePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: IUpdatePermission = req.body;

      await this.permission.updatePermission(body);

      // Respond with success message
      res.status(200).json({ message: 'Permission updated' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };
}
