import React from "react";
import "../styles/StatusBadge.css";

const StatusBadge = ({ status }) => {
    const normalized = status?.toLowerCase() || "pending";
    
    const getIcon = () => {
        switch (normalized) {
            case "approved": return <i className="fa-solid fa-circle-check"></i>;
            case "rejected": return <i className="fa-solid fa-circle-xmark"></i>;
            default: return <i className="fa-solid fa-clock"></i>;
        }
    };

    return (
        <span className={`status-badge ${normalized}`}>
            {getIcon()}
            {normalized.toUpperCase()}
        </span>
    );
}

export default StatusBadge;