import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { passport } from '@/config/passport';
import { Container } from 'typedi';
import { AdminService } from '@/services/admin.service';
import { Admin } from '@prisma/client';

/**
 * Controller handling admin-related HTTP requests.
 */
export class AdminController {
  // Initialize the AdminService via dependency injection
  public admin = Container.get(AdminService);

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
    return res.status(200).json({ message: 'User Profile', data: req.user });
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
      const adminId = (req.user as Admin).id; // Extract the admins ID from req.user

      const updatedAdmin = await this.admin.updateProfile(adminId, name, email);

      res.status(200).json({ message: 'Profile updated successfully', data: updatedAdmin });
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
      const adminId = (req.user as Admin).id; // Extract the admins ID from req.user

      await this.admin.updatePassword(adminId, currentPassword, newPassword);

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  };
}
