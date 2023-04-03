import { useState, useEffect } from "react";
import { Outlet, redirect, useNavigation } from "react-router-dom";
import NavBar from "../components/Shared/Bar/NavBar";
import SideBar from "../components/Shared/Bar/SideBar";
import { ROUTE_AUTH } from "../routes/routes";
import { setAuthorizationToken } from "../service";
import { getLoggedUser } from "../service/users/userAuth";
import { getAuthToken } from "../utils/token";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { accountsActions } from "../store/accounts";
import { getAccounts } from "../service/users/accounts";

function RootLayout() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const reset = async () => {
      const [loggedUser, accounts] = await Promise.all([
        getLoggedUser(),
        getAccounts(),
      ]);
      if (loggedUser.error || accounts.error)
        window.alert("An unexpected error ocurred");
      dispatch(accountsActions.addAccounts({accounts}));
      dispatch(authActions.login({ name: loggedUser.name }));
      setIsLoading(false);
    };
    reset();
  }, []);

  const openSideBar = () => {
    setIsOpen(true);
  };
  const closeSideBar = () => {
    setIsOpen(false);
  };
  return (
    <>
      {(navigation.state === "loading" || isLoading) && (
        <p style={{ textAlign: "center" }}>Loading...</p>
      )}
      <NavBar
        isOpen={isOpen}
        openSideBar={openSideBar}
        closeSideBar={closeSideBar}
      />
      <SideBar isOpen={isOpen} closeSideBar={closeSideBar} />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export const loaderRouteNotAuthenticated = async () => {
  console.log("running root loader")
  const token = getAuthToken();
  if (!token) {
    return redirect(ROUTE_AUTH);
  }
  setAuthorizationToken(token);
  return null;
};
export default RootLayout;
