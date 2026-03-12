import React from "react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../constants/roles";
import "../styles/Analytics.css";

import VideoBackground from "../components/VideoBackground";
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
    <>
    <VideoBackground />
      <div className="analytics-page">
        
        <h1>
          📊 Analytics
        </h1>

        <div className="analytics-grid">

          {/* Business Category Pie Chart */}
          <div className="chart-card">
            <BusinessCategoryChart />
          </div>

          {/* Business Density Heatmap */}
          <div className="chart-card">
            <BusinessHeatmap />
          </div>

        </div>

        <button onClick={handleMoveToDashboard}>
          <i className="fa-solid fa-arrow-left"></i> Back to dashboard
        </button>

      </div>
    </>
  );
};

export default AnalyticsPage;