import { useNavigation } from "react-router-dom";
import { AccountType } from "../../pages/Home";

type AccountsProps = {
  accounts: AccountType[];
};

function Accounts({ accounts }: AccountsProps) {
    const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
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
