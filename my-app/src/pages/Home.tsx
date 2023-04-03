import Accounts from "../components/Accounts/Accounts";
import { useSelector } from "react-redux";
import { RootState } from "../store";
function HomePage() {
  const myAccounts = useSelector((state: RootState) => state.myAccounts);
  return (
    <div style={{ textAlign: "center" }}>
      <h4>Your Accounts</h4>
      <Accounts accounts={myAccounts} />
    </div>
  );
}

export default HomePage;

/*export async function loader() {
  const token = getAuthToken();
  if (token) {
    const response = await getAccounts();
    return response.data;
  }
  return null;
}*/
