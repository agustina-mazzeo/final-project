import { Request, Response, NextFunction } from 'express';
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
    return res.status(400).send(e.errors); //improve this
  }
};

export default validateRequest;
