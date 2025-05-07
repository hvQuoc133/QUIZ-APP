import Sidebar from "./Sidebar";
import '../Admin/Admin.scss';
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { Outlet } from 'react-router-dom';
import Language from '../Header/Language';
import NavDropdown from 'react-bootstrap/NavDropdown';


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
                <div className="admin-header">
                    <div className="leftside">
                        <FaBars className={`icon-fabars ${collapsed ? 'collapsed' : ''}`} onClick={() => setCollapsed(!collapsed)} />
                    </div>         

                <div className="rightside">
                <NavDropdown title="Setting" id="basic-nav-dropdown">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                    <NavDropdown.Item>Log out</NavDropdown.Item>
                </NavDropdown>

                <Language />
                </div>
                </div>
                <div className="admin-main">
                    <Outlet />
                </div>          
            </div>
        </div>
    )
}

export default Admin;