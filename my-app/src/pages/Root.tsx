import { useState } from "react";
import { Outlet, redirect } from "react-router-dom";
import NavBar from "../components/Shared/NavBar";
import SideBar from "../components/Shared/SideBar";
import { ROUTE_INDEX } from "../routes/routes";
import { setAuthorizationToken } from "../service";
import { getAuthToken } from "../utils/token";

function RootLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const openSideBar = () => {
    setIsOpen(true);
  };
  const closeSideBar = () => {
    setIsOpen(false);
  };
  return (
    <>
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

export const loaderRouteNotAuthenticated = () => {
  const token = getAuthToken()
  if (!token) {
    return redirect(ROUTE_INDEX);
  }
  setAuthorizationToken(token)
  return null;
};
export default RootLayout;

