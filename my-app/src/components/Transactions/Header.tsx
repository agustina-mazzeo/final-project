import classes from "./transactionsTable.module.css";
import { Order, TransactionKeys } from "../../utils/types";
import Button from "../Shared/UI/Button";
import Input from "../Shared/UI/Input";


type HeaderProps = {
  columns: { label: string; key: TransactionKeys }[];
  sortHandler: (key: TransactionKeys) => void;
  filterHandler: (key: string, value: string, dateKey?:string) => void;
  sortKey: TransactionKeys;
  sortOrder: Order;
};
function Header({
  columns,
  sortHandler,
  filterHandler,
  sortKey,
  sortOrder,
}: HeaderProps) {
  return (
    <thead>
      <tr>
        {columns.map(({ label, key }) => {
          return (
            <th
              key={label}
              className={classes.transactionsCell}
              style={{ cursor: "pointer" }}
            >
              <Button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  padding: "5px 10px",
                  margin: 0,
                  lineHeight: 1,
                  fontSize: "15px",
                  color: "black",
                  cursor: "pointer",
                }}
                onClick={() => sortHandler(key)}
                buttonLabel={`${
                  sortKey === key && sortOrder === "desc" ? "🔽" : "🔼"
                }`}
              />
              {label === "Currency" || label === "Amount" ? (
                <>{label}</>
              ) : (
                <>
                  {label === "Date" ? (
                    <>
                      <label>{label}</label>
                      <Input type="date" onChange={(event) =>
                        filterHandler(key, event.target.value, "from")
                      }/>
                      <Input type="date"onChange={(event) =>
                        filterHandler(key, event.target.value, "to")
                      }/>
                    </>
                  ) : (
                    <Input
                      type="number"
                      placeholder={`Filter by`}
                      onChange={(event) =>
                        filterHandler(key, event.target.value)
                      }
                      label={label}
                    />
                  )}
                </>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
export default Header;
