import TransactionsTable from "../components/Transactions/TransactionsTable";
import { setAuthorizationToken } from "../service";
import { getAccounts } from "../service/accounts";
import { getTransactions } from "../service/transactions";
import { getAuthToken } from "../utils/token";

function TransactionsPage(){
    return <TransactionsTable/>
}
export default TransactionsPage;

export async function loader() {
    const token = getAuthToken();
    if (token) {
      setAuthorizationToken(token);
    }
    return null;
  }