import { NextFunction, Response, Request } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.clearCookie('connect.sid');
  return res.status(401).json({ message: 'Unauthenticated' });
};
