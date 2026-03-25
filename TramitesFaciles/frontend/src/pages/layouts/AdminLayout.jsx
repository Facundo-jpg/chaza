import "../../assets/css/Global.css";
import SideBar from "../../components/SideBarAdmin";
import { Outlet } from "react-router-dom";

function AdminLayout() {
    return (
        <div className="adminLayout">
            <SideBar />
            <div className="adminContent">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;
