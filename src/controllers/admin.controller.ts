import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { passport } from '@/config/passport';
import { Container } from 'typedi';
import { AdminService } from '@/services/admin.service';
import { Admin } from '@prisma/client';

export class AdminController {
  public admin = Container.get(AdminService);

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

  public logout = async (req: Request, res: Response) => {
    req.logout(e => {
      if (e) {
        return res.status(500).json({ message: 'Error during logout' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  };

  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpException(401, 'Not authenticated'));
    }
    delete (req.user as Admin).password;
    return res.status(200).json({ message: 'User Profile', data: req.user });
  };

  // Update profile details
  public updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body;
      const adminId = (req.user as Admin).id; // Now req.user is typed correctly

      const updatedAdmin = await this.admin.updateProfile(adminId, name, email);

      res.status(200).json({ message: 'Profile updated successfully', data: updatedAdmin });
    } catch (error) {
      next(error);
    }
  };

  // Update password
  public updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const adminId = (req.user as Admin).id; // Assuming req.user contains the logged-in admin

      await this.admin.updatePassword(adminId, currentPassword, newPassword);

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error); // Use error middleware for handling errors
    }
  };
}
