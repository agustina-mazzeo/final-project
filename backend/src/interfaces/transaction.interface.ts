export interface Transaction {
  accountFromId: number;
  accountToId: number;
  amount: number;
  description?: string;
}

export interface Pagination {
  pageNumber?: number;
  pageSize?: number;
}

export interface Sorting {
  sortBy?: keyof (Transaction & { createdAt: string; id: string });
  orderBy?: 'desc' | 'asc';
}

export interface Filters {
  from?: string;
  to?: string;
  accountFromId?: number;
}
