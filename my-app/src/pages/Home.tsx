import { getAccounts } from "../service/accounts";
import { useLoaderData } from "react-router-dom";
import Accounts from "../components/Accounts/Accounts";

export type AccountType = {
  id: number;
  balance: number;
  owner_id: number;
  createdAt: Date;
  updatedAt: Date;
  currency_id: number;
  currency: { name: string };
};

function HomePage() {
  const myAccounts = useLoaderData() as AccountType[];
  return (
    <div style={{ textAlign: "center" }}>
      <h4>Your Accounts</h4>
      <Accounts accounts={myAccounts} />
    </div>
  );
}

export default HomePage;

export async function loader() {
  const response = await getAccounts();
  return response.data;
}
