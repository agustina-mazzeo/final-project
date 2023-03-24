export type AccountType = {
  id: number;
  balance: number;
  owner_id: number;
  createdAt: string;
  updatedAt: string;
  currency_id: number;
  currency: { name: string };
};

export type Transaction = {
  id: number;
  description: string;
  amount: number;
  amount_from: number;
  amount_to: number;
  currency_name: string;
  createdAt: string;
  updatedAt: string;
  from_account_id: number;
  to_account_id: number;
};
export type TransactionKeys = keyof Transaction;
export type Order = "asc" | "desc"
export type Params = {
  from?: string;
  to?: string;
  from_account_id?: number;
  page?: number;
  page_size?: number;
  sort_by?: TransactionKeys;
  order_by?: Order;
};
