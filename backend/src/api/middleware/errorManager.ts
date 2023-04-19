import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorManager(err: Error, req: Request, res: Response, _: NextFunction) {
  res.status(500).send({ message: err.message, name: err.name });
}
export default errorManager;
