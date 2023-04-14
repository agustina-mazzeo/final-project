//Una transacción guarda la cuenta origen y destino, el monto, la fecha/hora y una descripción
//aportada por el usuario al momento de realizarla.
export interface Transaction {
  id: number;
  account_from: number;
  account_to: number;
  amount: number;
  createdAt: string;
  description?: string;
}
