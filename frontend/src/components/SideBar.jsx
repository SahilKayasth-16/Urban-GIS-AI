import React from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useNavigate, NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const SideBar = ({ onMapViewClick, onLayersClick }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { clearChat } = useChat();
    const role = user?.role || "user";

    const handlelogout = () => {
        logout();
        clearChat();
        navigate("/login");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <i className="fa-solid fa-city"></i>
                    <span>Urban GIS AI</span>
                </div>
            </div>

            <nav className={`sidebar-nav ${role === "admin" ? "scrollable" : ""}`}>
                <div className="nav-group">
                    <span className="group-label">Core View</span>
                    <ul>
                        <li onClick={onMapViewClick} className="sidebar-item">
                            <i className="fa-solid fa-map-location-dot"></i>
                            <span>Map View</span>
                        </li>
                        <li onClick={onLayersClick} className="sidebar-item">
                            <i className="fa-solid fa-layer-group"></i>
                            <span>Layers</span>
                        </li>
                        <li>
                            <NavLink to="/analytics" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                                <i className="fa-solid fa-chart-line"></i>
                                <span>Analytics</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {role === "admin" && (
                    <div className="nav-group">
                        <span className="group-label">Administration</span>
                        <ul>
                            <li>
                                <NavLink to="/admin/users" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                                    <i className="fa-solid fa-users-gear"></i>
                                    <span>User Access</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/business-approvals" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                                    <i className="fa-solid fa-building-circle-check"></i>
                                    <span>Approvals</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/settings" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                                    <i className="fa-solid fa-sliders"></i>
                                    <span>System Config</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">{user?.username?.charAt(0).toUpperCase() || "G"}</div>
                    <div className="user-info">
                        <span className="username">{user?.username || "Guest"}</span>
                        <span className="user-role">{role.toUpperCase()}</span>
                    </div>
                </div>
                <button className="logout-btn" onClick={handlelogout}>
                    <i className="fa-solid fa-power-off"></i>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

export default SideBar;