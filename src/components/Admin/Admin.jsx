import Sidebar from "./Sidebar";
import '../Admin/Admin.scss';
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { Outlet } from 'react-router-dom';

const Admin = (props) => {

    const [collapsed, setCollapsed] = useState(false);
    const [toggled, setToggled] = useState(false);

    const handleToggleSidebar = () => {
        setToggled(!toggled);
    };

    return (
        <div className="admin-contaner">
            <div className="admin-sidebar">
                <Sidebar collapsed={collapsed} toggled={toggled} handleToggleSidebar={handleToggleSidebar} />
            </div>
            <div className="admin-content">
                <div>
                    <FaBars className={`icon-fabars ${collapsed ? 'collapsed' : ''}`} onClick={() => setCollapsed(!collapsed)} />
                </div>
                <div className="admin-main">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Admin;