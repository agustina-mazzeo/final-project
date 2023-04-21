import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorManager = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message, name: err.name });
};
export default errorManager;
