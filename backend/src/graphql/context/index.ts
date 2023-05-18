import { Request } from 'express';
import { decodeAuthHeader } from '../utils/helpers';
import { IRateReadService, IUserReadService } from '../../services/interfaces';
import { rateReadService, userReadService } from './dataSources';

export interface Context {
  userId: string | undefined;
  dataSources: { rateReadService: IRateReadService; userReadService: IUserReadService };
}

export const context = async ({ req }: { req: Request }): Promise<Context> => {
  const token = req && req.headers.authorization ? decodeAuthHeader(req.headers.authorization) : null;

  return {
    userId: token?.id,
    dataSources: { rateReadService, userReadService },
  };
};
