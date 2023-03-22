
import { Link } from "react-router-dom"
import { ROUTE_HOME, ROUTE_INDEX } from "../../routes/routes"
import classes from "./SideBar.module.css"

type SideBarProps = {
    isOpen: boolean,
    closeSideBar: () => void

}
function SideBar({isOpen, closeSideBar}:SideBarProps){
    const widthBar = isOpen ? "250px" : "0px"
    return (
        <div style={{width: widthBar}} className={classes.sidenav}>
            <span className={classes.closebtn} onClick={closeSideBar}>X</span>
            <Link to={ROUTE_INDEX} onClick={closeSideBar}>Login Page</Link>
            <Link to={ROUTE_HOME} onClick={closeSideBar}>Home Page</Link>
        </div>
    )
}

export default SideBar