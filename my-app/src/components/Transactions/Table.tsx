import { useEffect, useState } from "react";
import { getTransactions } from "../../service/transactions/transactions";
import classes from "./transactionsTable.module.css";
import {
  Order,
  Pagination,
  Transaction,
  TransactionKeys,
} from "../../utils/types";
import { Params } from "../../utils/types";
import Header from "./Header";
import Body from "./Body";
import Foot from "./Foot";

const columns: { label: string; key: TransactionKeys }[] = [
  { label: "From", key: "from_account_id" },
  { label: "To", key: "to_account_id" },
  { label: "Currency", key: "currency_name" },
  { label: "Amount", key: "amount" },
  { label: "Date", key: "createdAt" },
];

function TransactionsTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [queryParams, setQueryParams] = useState<Params>({});
  const [sortKey, setSortKey] = useState<TransactionKeys>("createdAt");
  const [sortOrder, setSortOrder] = useState<Order>("desc");

  const fetchTransactions = async (params: Params) => {
    setIsLoading(true);
    const response = await getTransactions(params);
    setTransactions(response.data);
    setPagination(response.pagination);
    setIsLoading(false);
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      fetchTransactions({});
    }, 1000 * 60);
    const timeoutId = setTimeout(async () => {
      fetchTransactions(queryParams);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [queryParams]);

  const filterHandler = async (
    key: string,
    value: string,
    dateKey?: string
  ) => {
    if (dateKey) key = dateKey;
    if (value.trim().length === 0) {
      setQueryParams((prevQuery) => {
        delete prevQuery[key as keyof Params];
        return { ...prevQuery };
      });
    } else {
      setQueryParams((prevQuery) => {
        return {
          ...prevQuery,
          [key]: value,
        };
      });
    }
  };

  const sortHandler = async (key: TransactionKeys) => {
    let newSortOrder = sortOrder;
    if (key === sortKey) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newSortOrder);
    } else {
      setSortKey(key);
    }
    setQueryParams((prevQuery) => {
      delete prevQuery["page"];
      return {
        ...prevQuery,
        sort_by: key,
        order_by: newSortOrder,
      };
    });
  };

  const changePageHandler = (action: string) => {
    if (action === "next") {
      setQueryParams((prevQuery) => {
        return { ...prevQuery, page: pagination!.currentPage + 1 };
      });
    } else {
      setQueryParams((prevQuery) => {
        return { ...prevQuery, page: pagination!.currentPage - 1 };
      });
    }
  };
  return (
    <>
      {isLoading && <p style={{ textAlign: "center" }}>Loading...</p>}
      <table className={classes.transactionsTable}>
        <Header
          {...{ columns, sortHandler, filterHandler, sortKey, sortOrder }}
        />
        <Body {...{ transactions, columns }} />
        {pagination && <Foot {...{ pagination, changePageHandler, isLoading }} />}
      </table>
    </>
  );
}
export default TransactionsTable;
