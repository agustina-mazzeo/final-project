import { Account } from "../../utils/types";

type AccountsProps = {
  accounts: Account[];
};

function Accounts({ accounts }: AccountsProps) {
  return (
    <div>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>{account.balance}</li>
        ))}
      </ul>
    </div>
  );
}
export default Accounts;
