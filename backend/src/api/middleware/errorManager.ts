import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../interfaces';
import { errorStatusCodeMap } from '../../utils/helpers';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorManager = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) res.status(errorStatusCodeMap[err.errorType]).send({ errors: err.message });
  else res.status(500).send({ errors: err.message });
};
export default errorManager;
