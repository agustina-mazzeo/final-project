import { User } from '../../../interfaces';

export type UserOutputDTO = User & {
  id: string;
  role: string;
};
