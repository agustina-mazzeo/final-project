import Accounts from "../components/Accounts/Accounts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useState } from "react";
import { getAccounts } from "../service/users/accounts";
import { accountsActions } from "../store/accounts";
function HomePage() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const reset = async () => {
      const  accounts = await  getAccounts();
      if (accounts.error) {
        window.alert(accounts.error);
        return;
      }
      dispatch(accountsActions.addAccounts({ accounts }));
      setIsLoading(false)
    };
    reset();
  }, []);
  const myAccounts = useSelector((state: RootState) => state.myAccounts);
  return (
    <div style={{ textAlign: "center" }}>
      <h4>Your Accounts</h4>
      {!isLoading ? <Accounts accounts={myAccounts} />: <p>Loading...</p>}
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
