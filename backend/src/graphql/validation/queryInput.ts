import { object, string, coerce, TypeOf } from 'zod';

export const queryInputSchema = object({
  query: object({
    from: string().datetime({ message: 'Expected a DateString' }).optional(),
    to: string().datetime({ message: 'Expected a DateString' }).optional(),
    accountFrom: coerce.number({ invalid_type_error: 'Invalid Account' }).positive({ message: 'Account must be a positive number' }).optional(),
  }).strict(),
});

export type QueryInput = TypeOf<typeof queryInputSchema>;
