import "../../assets/css/Global.css";
import SideBarUser from "../../components/SideBarUser";
import { Outlet } from "react-router-dom";

function UserLayout() {
    return (
        <div className="userLayout">
            <SideBarUser />
            <div className="userContent">
                <Outlet />
            </div>
        </div>
    );
}

export default UserLayout;