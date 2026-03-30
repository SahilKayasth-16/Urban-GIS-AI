import React from "react";
import "../styles/TopBar.css";

const TopBar = ({ user, onChatClick }) => {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <div className="dashboard-indicator">
                    <span className="dot online"></span>
                    <h3>{user?.role === "admin" ? "Institutional Console" : "Intelligence Dashboard" }</h3>
                </div>
            </div>

            <div className="topbar-right">
                <button className="chat-btn pulse" onClick={onChatClick}>
                    <i className="fa-solid fa-robot"></i>
                    <span>GIS AI Assistant</span>
                </button>
            </div>
        </header>
    );
}

export default TopBar;