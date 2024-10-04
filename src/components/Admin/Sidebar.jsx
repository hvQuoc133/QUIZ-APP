import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { FaGem, FaGithub } from 'react-icons/fa';
import sidebarBg from '../../assets/bg2.jpg';
import { FaReact } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import '../Admin/Sidebar.scss';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ image, collapsed, toggled, handleToggleSidebar }) => {

    const navigate  = useNavigate();
    return (
        <>
            <ProSidebar
                image={sidebarBg}
                collapsed={collapsed}
                toggled={toggled}
                breakPoint="md"
                onToggle={handleToggleSidebar}
            >
                <SidebarHeader>
                    <div className='sidebar-header'>
                        <FaReact className="spin-icon" />
                        <span onClick={() => navigate('/')}>React App</span>
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <Menu iconShape="circle">
                        <MenuItem
                            icon={<MdDashboard />}
                        >
                            Dasdboard
                            <Link to="/admin" />
                        </MenuItem>
                    </Menu>

                    <Menu iconShape="circle">
                        <SubMenu
                            icon={<FaGem />}
                            title='Features'
                        >
                            <MenuItem>
                                Quản lý Users
                                <Link to="/admin/manage-users" />
                            </MenuItem>
                            <MenuItem>
                             Quản lý bài Quiz
                                <Link to="/admin/manage-quizzes" />
                             </MenuItem>
                            <MenuItem> Quản lý câu hỏi</MenuItem>
                        </SubMenu>
                    </Menu>
                </SidebarContent>

                <SidebarFooter className='sidebar-footer'>
                    <div className="sidebar-btn-wrapper">
                        <a
                            href="https://www.facebook.com/quochom11111/"
                            target="_blank"
                            className="sidebar-btn"
                            rel="noopener noreferrer"
                        >
                            <FaGithub />
                            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                &#169; VanQuoc
                            </span>
                        </a>
                    </div>
                </SidebarFooter>
            </ProSidebar>
        </>
    )
}

export default Sidebar;