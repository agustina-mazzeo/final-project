import { getAccounts } from "../service/users/accounts";
import { useLoaderData } from "react-router-dom";
import Accounts from "../components/Accounts/Accounts";
import { Account } from "../utils/types";
import { getAuthToken } from "../utils/token";
import { setAuthorizationToken } from "../service";

function HomePage() {
  const myAccounts = useLoaderData() as Account[];
  return (
    <div style={{ textAlign: "center" }}>
      <h4>Your Accounts</h4>
      <Accounts accounts={myAccounts} />
    </div>
  );
}

export default HomePage;

export async function loader() {
  const token = getAuthToken();
  if (token) {
    setAuthorizationToken(token);
    const response = await getAccounts();
    return response.data;
  }
  return null;
}
