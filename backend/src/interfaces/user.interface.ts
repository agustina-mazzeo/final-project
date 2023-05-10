export interface User {
  id: number;
  name?: string;
  email: string;
  password: string;
}

export interface Account {
  id: number;
  user_id: number;
  currency: string;
  balance: number;
}

export interface TokenData {
  token: string;
  expiresIn: string;
}

export interface DataStoredInToken {
  email: string;
  id: string;
}
