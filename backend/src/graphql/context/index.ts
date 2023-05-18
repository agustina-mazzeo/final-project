import { Request } from 'express';
import { decodeAuthHeader } from '../utils/helpers';
import { IAccountReadService, IRateReadService, IUserReadService, IUserWriteService } from '../../services/interfaces';
import { rateReadService, userReadService, userWriteService, accountReadService } from './dataSources';

export interface Context {
  userId: string | undefined;
  dataSources: {
    rateReadService: IRateReadService;
    userReadService: IUserReadService;
    userWriteService: IUserWriteService;
    accountReadService: IAccountReadService;
  };
}

export const context = async ({ req }: { req: Request }): Promise<Context> => {
  const token = req && req.headers.authorization ? decodeAuthHeader(req.headers.authorization) : null;

  return {
    userId: token?.id,
    dataSources: { rateReadService, userReadService, userWriteService, accountReadService },
  };
};
