import { useState, useEffect } from "react";
import {
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import NavBar from "../components/Shared/Bar/NavBar";
import SideBar from "../components/Shared/Bar/SideBar";
import { ROUTE_AUTH } from "../routes/routes";
import { setAuthorizationToken } from "../service";
import { getLoggedUser } from "../service/users/userAuth";
import { getAuthToken } from "../utils/token";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

function RootLayout() {
  const navigation = useNavigation();
  const data = useLoaderData() as { name: string };
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    dispatch(authActions.login({ name: data.name }));
    setIsLoading(false);
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
  const token = getAuthToken();
  if (!token) {
    return redirect(ROUTE_AUTH);
  }
  setAuthorizationToken(token);
  const response = await getLoggedUser();
  return response;
};
export default RootLayout;
