import TransactionsTable from "../components/Transactions/Table";
import { setAuthorizationToken } from "../service";
import { getAuthToken } from "../utils/token";

function TransactionsPage() {
  return <TransactionsTable />;
}
export default TransactionsPage;

export async function loader() {
  const token = getAuthToken();
  if (token) {
    setAuthorizationToken(token);
  }
  return null;
}
