import classes from "./NavBar.module.css";
import { NavLink } from "react-router-dom";
import { ROUTE_HOME } from "../../routes/routes";

type NavBarProps = {
  openSideBar: () => void;
  closeSideBar: () => void;
  isOpen: boolean;
};
function NavBar({ openSideBar, closeSideBar, isOpen }: NavBarProps) {
  return (
    <header className={classes.header}>
      <div style={{ textAlign: "left" }}>
        <img
          src="data:image/png;base64,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"
          width="30"
          height="30"
          alt=""
        />
      </div>
      <span
        style={{ cursor: "pointer" }}
        onClick={isOpen ? closeSideBar : openSideBar}
      >
        ☰
      </span>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to={ROUTE_HOME}
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default NavBar;
