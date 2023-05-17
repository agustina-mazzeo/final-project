import { Request } from 'express';
import { decodeAuthHeader } from '../utils/helpers';

export interface Context {
  userId: string | undefined;
}

export const context = async ({ req }: { req: Request }): Promise<Context> => {
  const token = req && req.headers.authorization ? decodeAuthHeader(req.headers.authorization) : null;

  return {
    userId: token?.id,
  };
};
