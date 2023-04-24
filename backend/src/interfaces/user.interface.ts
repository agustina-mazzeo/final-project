export interface User extends UserData {
  id: number;
}

export interface UserData {
  name?: string;
  email: string;
  password: string;
}

export interface Account {
  id: number;
  id_user: number;
  currency: string;
  balance: number;
}

export interface TokenData {
  token: string;
  expiresIn: string;
}

export interface DataStoredInToken {
  email: string;
  id: number;
}
