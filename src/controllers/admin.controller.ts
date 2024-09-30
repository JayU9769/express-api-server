import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { passport } from '@/config/passport';
import { Container } from 'typedi';
import { AdminService } from '@/services/admin.service';
import {Admin, UserType} from '@prisma/client';
import { IDataTable, IFindAllPaginateOptions } from '@/interfaces/datatable.interface';
import {IAuthUser, IUpdateAction, TSortType} from '@/interfaces/global.interface';
import * as console from 'node:console';
import RolePermissionService from '@/role-permissions/RolePermissionService';
import {PermissionService} from "@/services/permission.service";

/**
 * Controller handling admin-related HTTP requests.
 */
export class AdminController {
  // Initialize the AdminService via dependency injection
  public admin = Container.get(AdminService);
  public rolePermissionService = Container.get(RolePermissionService);
  public permissionService = Container.get(PermissionService);

  /**
   * @description Handles admin login functionality using Passport's local strategy.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function to pass control to the next middleware.
   * @returns A JSON response with a success message and admin data or an error.
   */
  public login = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('admin-local', (e: Error, admin: Admin) => {
      if (e || !admin) {
        return next(new HttpException(401, 'Invalid credentials'));
      }
      req.login(admin, loginErr => {
        if (loginErr) {
          return next(new HttpException(500, 'Login failed'));
        }
        return res.status(200).json({ message: 'Logged in successfully', data: admin });
      });
    })(req, res, next);
  };

  /**
   * @description Logs out the currently authenticated admin and clears the session cookie.
   * @param req - Express request object.
   * @param res - Express response object.
   * @returns A JSON response indicating successful logout or an error message.
   */
  public logout = async (req: Request, res: Response) => {
    req.logout(e => {
      if (e) {
        return res.status(500).json({ message: 'Error during logout' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  };

  /**
   * @description Retrieves the profile of the currently authenticated admin.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function to pass control to the next middleware.
   * @returns A JSON response with the admins profile data or an error message.
   */
  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpException(401, 'Not authenticated'));
    }

    const admin = req.user as IAuthUser;
    const permission = await this.permissionService.getPermissions();

    const mergedPermissions = admin.roles.reduce((acc, role) => {
      const permissions = permission[UserType.admin][role] || []; // Get permissions for the role or an empty array
      return [...acc, ...permissions]; // Merge permissions into accumulator
    }, [] as string[]);

    // Remove duplicates using Set and return the result as an array
    (req.user as IAuthUser).permissions = [...new Set(mergedPermissions)];

    // Save the updated session
    req.session.save(err => {
      if (err) {
        return next(err);
      }
    });

    return res.status(200).json({ message: 'Admin Profile', data: req.user });
  };

  /**
   * @description Updates the profile details of the currently authenticated admin.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function to pass control to the next middleware.
   * @returns A JSON response with the updated admin data or an error message.
   */
  public updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body;
      const admin = req.user as IAuthUser; // Extract the admins ID from req.admin
      const updatedAdmin = await this.admin.updateProfile(admin.id, name, email);

      // Update the session with the new profile data
      admin.name = updatedAdmin.name;
      admin.email = updatedAdmin.email;

      req.user = admin;

      // Save the updated session
      req.session.save(err => {
        if (err) {
          return next(err);
        }
      });

      res.status(200).json({
        message: 'Profile updated successfully',
        data: updatedAdmin,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @description Updates the password of the currently authenticated admin.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function to pass control to the next middleware.
   * @returns A JSON response indicating successful password update or an error message.
   */
  public updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const adminId = (req.user as Admin).id; // Extract the admins ID from req.admin

      await this.admin.updatePassword(adminId, currentPassword, newPassword);

      res.clearCookie('connect.sid'); // Clear session cookie

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  };

  /**
   * Retrieves a paginated list of admins based on query parameters.
   * Supports pagination, filtering, sorting, and search.
   * @method get
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public getAdmins = async (req: Request, res: Response, next: NextFunction) => {
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

      // Fetch paginated admin data
      const findAllAdminsData: IDataTable<Admin> = await this.admin.findAllPaginate(options);
      // Respond with the fetched data
      res.status(200).json({ data: findAllAdminsData, message: 'findAll' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Retrieves a single admin by their ID.
   * @method get
   * @param req Express request object with admin ID in params
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public getAdminById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId: string = req.params.id;
      // Find admin by ID
      const findOneAdminData: Admin = await this.admin.findById(adminId);

      const roles = await this.rolePermissionService.getRoles(adminId, 'admin');

      // Respond with the fetched admin data
      res.status(200).json({ data: { ...findOneAdminData, roles: roles.map(role => role.id) }, message: 'findOne' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Creates a new admin with provided data.
   * @method post
   * @param req Express request object with admin data in body
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roles, ...rest } = req.body;
      const adminData: Admin = rest;
      // Create new admin
      const createAdminData: Admin = await this.admin.create(adminData);

      if (roles.length > 0) {
        this.rolePermissionService.syncRoles(createAdminData.id, roles, 'admin');
      }

      // Respond with the created admin data
      res.status(201).json({ data: createAdminData, message: 'created' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Updates an existing admin with provided data.
   * @method put
   * @param req Express request object with admin ID in params and admin data in body
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminId: string = req.params.id;
      const { roles, ...rest } = req.body;
      const adminData: Admin = rest;
      // // Update admin by ID
      const updateAdminData: Admin = await this.admin.update(adminId, adminData);

      if (roles.length > 0) {
        this.rolePermissionService.syncRoles(adminId, roles, 'admin');
      }

      // Respond with the updated admin data
      res.status(200).json({ data: updateAdminData, message: 'updated' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Deletes a admin by their ID.
   * @method delete
   * @param req Express request object with admin ID in params
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminIds: string[] = req.body.ids;
      // Delete admin by ID
      await this.admin.delete(adminIds);

      // Respond with success message
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  /**
   * Single action a admins by their ID & Type.
   * @method post
   * @param req Express request object with admin ID in params
   * @param res Express response object
   * @param next Express next function for error handling
   */
  public updateAction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids, field }: IUpdateAction = req.body;

      await this.admin.updateAction({ ids, field });

      // Respond with success message
      res.status(200).json({ message: 'Updated Bulk Action' });
    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };

  public updateAdminPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newPassword, confirmNewPassword } = req.body;

      const adminId: string = req.params.id;

      // Check if newPassword and confirmNewPassword match
      if (newPassword !== confirmNewPassword) {
        return res.status(422).json({ error: 'New password and confirm password do not match' });
      }

      await this.admin.updatePasswordWithoutCurrent(adminId, newPassword);

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  };
}
