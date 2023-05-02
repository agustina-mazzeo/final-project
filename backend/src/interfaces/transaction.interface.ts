export interface Transaction {
  id: number;
  createdAt: string;
  account_from: number;
  account_to: number;
  amount: number;
  description?: string;
}
