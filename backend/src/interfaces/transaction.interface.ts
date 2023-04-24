export interface Transaction {
  id: number;
  createdAt: string;
  account_from: number;
  account_to: number;
  amount: number;
  description?: string;
}

export type Transfer = Pick<Transaction, 'account_from' | 'account_to' | 'amount' | 'description'>;
