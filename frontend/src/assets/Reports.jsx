import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Reports.css";
import AppHeader from "../components/AppHeader";

const Reports = () => {
    const navigate = useNavigate();

    const [ reports, setReports ] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:8000/analysis/user-results", {
                headers: { 
                    Authorization: `Bearer ${token}`
                }
            });
            setReports(res.data);
        };

        fetchReports();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(`http://localhost:8000/analysis/delete/${id}`, { 
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
            setReports(prev => prev.filter(r => r.id !== id));
        } catch(error) {
            console.error("Delete failed:", error);
            alert("Failed to delete report");
        }      
    };

    return (
        <div className="reports-page-wrapper">
            <AppHeader />
            <div className="reports-container">
                <div className="report-header">
                    <div>
                        <h1>Analysis Reports</h1>
                        <p>Access and manage your generated urban intelligence reports</p>
                    </div>
                </div>

                {reports.length === 0 ? (
                    <div className="empty-state">
                        <i className="fa-solid fa-folder-open"></i>
                        <h3>No reports found</h3>
                        <p>Try running a GIS analysis from your dashboard.</p>
                        <button className="btn btn-primary" onClick={() => navigate("/userdashboard")}>Go to Dashboard</button>
                    </div>
                ) : (
                    <div className="report-grid">
                        {reports.map((report) => (
                            <div className="report-card" key={report.id}>
                                <div className="report-icon">
                                    <i className="fa-solid fa-file-invoice"></i>
                                </div>
                                <h3>{report.area_name}</h3>

                                <div className="report-info">
                                    <p>
                                        <i className="fa-solid fa-location-dot"></i>
                                        {Number(report.latitude).toFixed(4)}, {Number(report.longitude).toFixed(4)}
                                    </p>
                                    <p>
                                        <i className="fa-solid fa-calendar"></i>
                                        {new Date(report.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="report-card-actions">
                                    <button className="btn btn-primary" onClick={() => navigate(`/result/${report.id}`)}>View Report</button>
                                    <button className="btn btn-delete" onClick={() => {if (window.confirm("Delete this report?")) handleDelete(report.id)}}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;