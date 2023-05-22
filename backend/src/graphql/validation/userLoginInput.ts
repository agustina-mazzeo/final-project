import { object, string, TypeOf } from 'zod';

export const userLoginInputSchema = object({
  user: object({
    password: string({
      required_error: 'Password is required',
    }).min(6, 'Password too short - should be 6 chars minimum'),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
  }).strict(),
});

export type UserLoginInput = TypeOf<typeof userLoginInputSchema>;
