import { PrismaClient, Prisma } from '@prisma/client';

export * from './User/UserInput';
export * from './User/UserOutput';
export * from './Account/AccountInput';
export * from './Account/AccountOutput';
export * from './Rate/RateInput';
export * from './Rate/RateOutput';
export * from './Transaction/TransactionInput';
export * from './Transaction/TransactionOutput';

export type PrismaContext = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;
