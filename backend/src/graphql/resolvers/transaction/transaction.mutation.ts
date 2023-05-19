import { CustomError } from '../../../interfaces';
import { Context } from '../../context';
import { GraphQLError } from 'graphql';
import { validateArgs, TransactionInput, transactionInputSchema } from '../../validation';
import { transferToDTO } from './transaction.dto';

export const transactionMutations = {
  newTransfer: async (parent: undefined, args: TransactionInput, contextValue: Context) => {
    try {
      const { transfer } = (await validateArgs(transactionInputSchema, args)) as TransactionInput;
      const userId = contextValue.userId;
      const newTransfer = await contextValue.dataSources.transactionWriteService.create({ userId, transfer: transferToDTO(transfer) });
      return {
        ...newTransfer,
        createdAt: newTransfer.created_at,
        accountFromId: newTransfer.account_from_id,
        accountToId: newTransfer.account_to_id,
      };
    } catch (error: any) {
      if (error instanceof CustomError)
        throw new GraphQLError(error.message, {
          extensions: { code: error.errorType },
        });
      throw error;
    }
  },
};
