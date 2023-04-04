import { numWithCommas } from "../../utils/auxFunctions";
import { Account } from "../../utils/types";

type AccountsProps = {
  accounts: Account[];
};

function Accounts({ accounts }: AccountsProps) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>
            <div
              style={{
                backgroundColor: "aliceblue",
                textAlign: "center",
                padding: "25px",
                height: "150px",
                width: "300px",
              }}
            >
              <span>Account ID: {`${account.id}`}</span>
              <br />
              <span>Currency: {`${account.currency.name}`}</span>
              <br />
              <span>Balance: {`${numWithCommas(account.balance)}`}</span>
            </div>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Accounts;
