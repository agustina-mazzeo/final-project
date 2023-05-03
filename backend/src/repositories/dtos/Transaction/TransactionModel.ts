export type TransactionModelDTO = {
  id: number;
  account_from: number;
  account_to: number;
  amount: number;
  description?: string;
  createdAt: string;
};
