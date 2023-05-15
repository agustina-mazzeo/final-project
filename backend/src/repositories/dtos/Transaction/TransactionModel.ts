export type TransactionModelDTO = {
  id: string;
  account_from_id: number;
  account_to_id: number;
  amount: number;
  description?: string;
  created_at: string;
};
