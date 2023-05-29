import { User } from '../../../interfaces';

export type UserModelDTO = User & {
  id: string;
  role: string;
};
