import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { passport } from '@/config/passport';

export class AdminController {
  public login = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('admin-local', (err, admin, info) => {
      if (err || !admin) {
        return next(new HttpException(401, 'Invalid credentials'));
      }
      req.login(admin, loginErr => {
        if (loginErr) {
          return next(new HttpException(500, 'Login failed'));
        }
        return res.json({ message: 'Logged in successfully' });
      });
    })(req, res, next);
  };

  public logout = async (req: Request, res: Response) => {
    req.logout(err => {
      if (err) {
        return res.status(500).json({ message: 'Error during logout' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      return res.json({ message: 'Logged out successfully' });
    });
  };

  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpException(401, 'Not authenticated'));
    }
    return res.json(req.user);
  };

  public updateProfile = async (req: Request, res: Response, next: NextFunction) => {};
  public updatePassword = async (req: Request, res: Response, next: NextFunction) => {};
}
