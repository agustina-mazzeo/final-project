export type TransactionOutputDTO = {
  id: number;
  account_from: number;
  account_to: number;
  amount: number;
  description?: string;
  createdAt: string;
};
