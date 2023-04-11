import { Link } from "react-router-dom";
import { ROUTE_HOME, ROUTE_AUTH, ROUTE_TRANSACTIONS, ROUTE_TRANSFER_FORM } from "../../../routes/routes";
import classes from "./SideBar.module.css";

type SideBarProps = {
  isOpen: boolean;
  closeSideBar: () => void;
};
function SideBar({ isOpen, closeSideBar }: SideBarProps) {
  const widthBar = isOpen ? "250px" : "0px";
  return (
    <div style={{ width: widthBar }} className={classes.sidenav}>
      <span style={{color: "white"}}className={classes.closebtn} onClick={closeSideBar}>
        X
      </span>
      <Link to={ROUTE_HOME} onClick={closeSideBar}>
        Home
      </Link>
      <Link to={ROUTE_TRANSACTIONS} onClick={closeSideBar}>
        Transactions
      </Link>
      <Link to={ROUTE_TRANSFER_FORM} onClick={closeSideBar}>
        New Transfer
      </Link>
    </div>
  );
}

export default SideBar;
