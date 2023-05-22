import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../interfaces';
import { ROLE } from '../../utils/helpers';

export const authorize = (roleType: ROLE) => (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.user as { role: string; id: string };
  if (role !== roleType) next(new UnauthorizedError('Not authorized'));
  next();
};
