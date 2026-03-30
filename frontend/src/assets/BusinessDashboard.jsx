import React from "react";
import "../styles/BusinessDashboard.css";
import { useNavigate } from "react-router-dom";
import BusinessCard from "../components/BusinessCard";
import AppHeader from "../components/AppHeader";

const BusinessDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="business-dashboard-page">
            <AppHeader />
            <div className="business-dashboard">
                <div className="business-header">
                    <div>
                        <h1>Business Dashboard</h1>
                        <p>Welcome back, {user?.username || 'Partner'}. Manage your registrations and track progress.</p>
                    </div>
                </div>

                <div className="business-stats">
                    <div className="business-stat-card">
                        <i className="fa-solid fa-briefcase"></i>
                        <div className="business-stat-info">
                            <h4>Active Businesses</h4>
                            <span>0</span>
                        </div>
                    </div>
                    <div className="business-stat-card">
                        <i className="fa-solid fa-clock"></i>
                        <div className="business-stat-info">
                            <h4>Pending Approvals</h4>
                            <span>0</span>
                        </div>
                    </div>
                    <div className="business-stat-card">
                        <i className="fa-solid fa-circle-check"></i>
                        <div className="business-stat-info">
                            <h4>Total Approved</h4>
                            <span>0</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-cards">
                    <BusinessCard 
                        title="New Business Registration"
                        description="Identify optimal locations and register your new venture using AI-driven geospatial insights."
                        icon="➕"
                        onClick={() => navigate("/business/register")} 
                    />

                    <BusinessCard 
                        title="How It Works"
                        description="Understand the multi-stage approval process and required documentation."
                        icon="📖"
                        onClick={() => navigate("/business/process")} 
                    />

                    <BusinessCard 
                        title="Approval Status"
                        description="Monitor the real-time status of your submitted business applications."
                        icon="⏳"
                        onClick={() => navigate("/business/status")} 
                    />
                </div>
            </div>
        </div>
    );
};

export default BusinessDashboard;