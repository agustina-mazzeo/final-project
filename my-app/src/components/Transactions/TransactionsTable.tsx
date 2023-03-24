import { useEffect, useState } from "react";
import { getTransactions } from "../../service/transactions";
import Input from "../Shared/UI/Input";
import classes from "./transactionsTable.module.css";
import { Order, Transaction, TransactionKeys } from "../../utils/types";
import { Params } from "../../utils/types";
const columns = [
  { label: "From", id: "from_account_id" },
  { label: "To", id: "to_account_id" },
  { label: "Currency", id: "currency_name" },
  { label: "Amount", id: "amount" },
  { label: "Date", id: "createdAt" },
];

function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterInputs, setFilterInputs] = useState<Params>({});
  const [sortKey, setSortKey] = useState<TransactionKeys>("createdAt")
  const [sortOrder, setSortOrder] = useState<Order>("desc")
  useEffect(() => {
    const reset = async () => {
      const response = await getTransactions({});
      setTransactions(response.data);
    };
    reset();
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      const response = await getTransactions(filterInputs);
      setTransactions(response.data);
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [filterInputs]);

  const filterHandler = async (key: string, value: string) => {
    if (key === "createdAt") key = "from";
    if (value.trim().length === 0) {
      const newFilterInputs = { ...filterInputs };
      delete newFilterInputs[key as keyof Params];
      setFilterInputs(newFilterInputs);
    } else {
      setFilterInputs({
        ...filterInputs,
        [key]: value,
      });
    }
  };

  const sortHandler = async (id: string) => {
    const response = await getTransactions({
      sort_by: id as TransactionKeys,
      order_by: "asc",
    });
    setTransactions(response.data);
  };

  return (
    <table className={classes.transactionsTable}>
      <thead>
        <tr>
          {columns.map(({ label, id }) => {
            return (
              // 🔽🔼
              <th
                key={label}
                className={classes.transactionsCell}
                style={{ cursor: "pointer" }}
              >
                <span onClick={(event) => sortHandler(id)}>⛖</span>
                {label !== "Currency" && label !== "Amount" ? (
                  <Input
                    placeholder={`Filter by`}
                    onChange={(event) => filterHandler(id, event.target.value)}
                    label={label}
                  />
                ) : (
                  <>{label}</>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {transactions.map((txn) => {
          return (
            <tr key={txn.id}>
              {columns.map(({ id }) => {
                return (
                  <td
                    className={classes.transactionsCell}
                    key={`${txn.id}_${id}`}
                  >
                    {id === "createdAt"
                      ? txn[id].slice(0, 10)
                      : txn[id as TransactionKeys]}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export default TransactionsTable;
