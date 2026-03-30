import React, { useEffect, useState } from "react";
import "../styles/BusinessApprovals.css";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BusinessTable from "../components/BusinessTable";

const BusinessApprovals = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filter, setFilter] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/admin/businesses", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setBusinesses(data);
        } else {
          setBusinesses([]);
        }
      });
  }, []);

  const filtered = businesses.filter(b => b.status === filter);

  return (
    <div className="admin-page-wrapper">
      <AppHeader />
      <div className="admin-container">
        <div className="admin-header">
            <div>
                <h1>Business Approvals</h1>
                <p>Manage pending submissions and verify urban integration requests.</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate("/admindashboard")}>
                <i className="fa-solid fa-arrow-left"></i> Dashboard
            </button>
        </div>

        <div className="filter-wrapper">
            <div className="filter-tabs">
                <button className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>Pending</button>
                <button className={filter === "approved" ? "active" : ""} onClick={() => setFilter("approved")}>Approved</button>
                <button className={filter === "rejected" ? "active" : ""} onClick={() => setFilter("rejected")}>Rejected</button>
            </div>
        </div>

        <div className="approvals-table-card">
            <BusinessTable businesses={filtered} refresh={setBusinesses} />
        </div>
      </div>
    </div>
  );
};

export default BusinessApprovals;
