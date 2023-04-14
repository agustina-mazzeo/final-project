export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface Account {
  id: number;
  id_user: number;
  currency: string;
  balance: number;
}
