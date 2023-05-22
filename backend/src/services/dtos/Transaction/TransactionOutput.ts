export type TransactionOutputDTO = {
  id: string;
  accountFromId: number;
  accountToId: number;
  amount: number;
  description?: string;
  createdAt: string;
};
