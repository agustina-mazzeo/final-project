import { Account } from '../src/interfaces';
let acc_id = 0;
export const inc_acc = () => {
  return ++acc_id;
};

export const accounts: Account[] = [];
