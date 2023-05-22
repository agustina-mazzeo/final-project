import { object, string, coerce, TypeOf } from 'zod';

export const transactionInputSchema = object({
  transfer: object({
    accountFrom: coerce
      .number({ invalid_type_error: 'Account must be a positive number', required_error: 'Account From is required' })
      .positive({ message: 'Invalid Account' }),
    accountTo: coerce
      .number({ invalid_type_error: 'Account must be a positive number', required_error: 'Account To is required' })
      .positive({ message: 'Invalid Account' }),
    amount: coerce
      .number({ invalid_type_error: 'Amount must be a positive number', required_error: 'Amount is required' })
      .positive({ message: 'Invalid Amount' }),
    description: string().optional(),
  })
    .strict()
    .refine(data => data.accountFrom !== data.accountTo, {
      message: 'Please select a different account',
      path: ['accountTo'],
    }),
});

export type TransactionInput = TypeOf<typeof transactionInputSchema>;
