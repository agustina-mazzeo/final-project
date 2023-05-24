export interface User {
  name?: string;
  email: string;
  password: string;
}

export interface Account {
  id: number;
  userId: string;
  currency: string;
  balance: number;
}

export interface TokenData {
  token: string;
  expiresIn: string;
}

export interface DataStoredInToken {
  role: string;
  id: string;
}
