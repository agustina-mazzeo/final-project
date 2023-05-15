import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../interfaces';
import { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.query = parsed.query;
    req.body = parsed.body;
    req.params = parsed.params;
    next();
  } catch (e: any) {
    const errors: string = e.issues.reduce((acumulator: string, { message }: any, index: number) => {
      if (index === 0) {
        return message;
      } else if (index === e.issues.length - 1) {
        return `${acumulator} and ${message}`;
      } else {
        return `${acumulator}, ${message}`;
      }
    }, '');
    next(new ValidationError(errors));
    //res.status(400).send({ error: e });
  }
};

export default validateRequest;
