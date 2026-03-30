import React from "react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../constants/roles";
import "../styles/Analytics.css";
import AppHeader from "../components/AppHeader";
import BusinessCategoryChart from "../components/BusinessDistributionCategoryChart";
import BusinessHeatmap from "../components/BusinessHeatmap";

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleMoveToDashboard = () => {
    if (user?.role === ROLES.ADMIN) {
      navigate("/admindashboard");
    } else {
      navigate("/userdashboard");
    }
  };

  return (
    <div className="analytics-page-wrapper">
      <AppHeader />
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>📊 Analytics Dashboard</h1>
          <p>Visualizing business distributions and geospatial density</p>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3><i className="fa-solid fa-chart-pie"></i> Business Category Distribution</h3>
            <BusinessCategoryChart />
          </div>

          <div className="chart-card">
            <h3><i className="fa-solid fa-fire"></i> Business Density Heatmap</h3>
            <BusinessHeatmap />
          </div>
        </div>

        <div className="analytics-actions">
           <button className="btn btn-secondary" onClick={handleMoveToDashboard}>
            <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;