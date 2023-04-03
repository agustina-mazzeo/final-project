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

export type Pagination = {
  hasMorePages: boolean;
  pageSize: number;
  currentPage: number;
  totalRows: number;
  totalPages: number;
};
export type PaginationKeys = keyof Pagination;

export type Order = "asc" | "desc";
export type Params = {
  from?: string;
  to?: string;
  from_account_id?: number;
  page?: number;
  page_size?: number;
  sort_by?: TransactionKeys;
  order_by?: Order;
};
export type Currency = "USD" | "URU" | "EU";
export type Account = {
  id: number;
  balance: number;
  owner_id: number;
  createdAt: string;
  updatedAt: string;
  currency_id: number;
  currency: {
    name: Currency;
  };
};

export type TransferData = {
  account_from: string | number;
  account_to: string | number;
  amount: string | number;
  currency_name: string;
  description?: string;
};
