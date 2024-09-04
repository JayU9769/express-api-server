import {NextFunction, Request, Response} from "express";
import {HttpException} from "@/exceptions/HttpException";


export class AdminController {

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {

      if (!req.user) {
        throw new HttpException(401, 'Authentication failed');
      }
      res.status(200).json({ data: req.user, message: 'Authenticated' });

    } catch (error) {
      // Pass any errors to the next error handling middleware
      next(error);
    }
  };
}