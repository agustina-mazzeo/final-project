import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/Shared/NavBar";
import SideBar from "../components/Shared/SideBar";

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
export default RootLayout;
