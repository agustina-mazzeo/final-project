import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../interfaces';
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
    const errors: string[] = e.issues.map(({ message }: any) => {
      return message;
    });
    next(new CustomError('VALIDATION_ERROR', errors));
    //res.status(400).send({ error: e });
  }
};

export default validateRequest;
