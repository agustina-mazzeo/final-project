import { Transaction, TransactionKeys } from "../../utils/types";
import classes from "./transactionsTable.module.css";
type BodyProps ={
    transactions: Transaction[]
    columns: { label: string; key: TransactionKeys }[]

}

function Body({transactions, columns}:BodyProps){
    return <tbody>
    {transactions.map((txn) => {
      return (
        <tr key={txn.id}>
          {columns.map(({ key }) => {
            return (
              <td
                className={classes.transactionsCell}
                key={`${txn.id}_${key}`}
              >
                {key === "createdAt" ? txn[key].slice(0, 10) : txn[key]}
              </td>
            );
          })}
        </tr>
      );
    })}
  </tbody>
}
export default Body