import { object, string, coerce, TypeOf } from 'zod';

export const transactionsSchema = object({
  query: object({
    from: string().datetime({ message: 'Expected a DateString' }).optional(),
    to: string().datetime({ message: 'Expected a DateString' }).optional(),
    account_from: coerce.number({ invalid_type_error: 'Account must be a positive number' }).positive({ message: 'Invalid Account' }).optional(),
  }),
}).strict();

export type TransactionsQuery = TypeOf<typeof transactionsSchema>['query'];

export const transferSchema = object({
  body: object({
    account_from: coerce
      .number({ invalid_type_error: 'Account must be a positive number', required_error: 'Account From is required' })
      .positive({ message: 'Invalid Account' }),
    account_to: coerce
      .number({ invalid_type_error: 'Account must be a positive number', required_error: 'Account To is required' })
      .positive({ message: 'Invalid Account' }),
    amount: coerce
      .number({ invalid_type_error: 'Amount must be a positive number', required_error: 'Amount From is required' })
      .positive({ message: 'Invalid Amount' }),
    description: string().optional(),
  }).refine(data => data.account_from !== data.account_to, {
    message: 'Please select a different account',
    path: ['account_to'],
  }),
}).strict();

export type TransferBody = TypeOf<typeof transferSchema>['body'];
