import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Reports.css";
import VideoBackground from "../components/VideoBackground";

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

            await axios.delete(`http://localhost:8000/analysis/delete/${id}`,{ 
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            }
        );
            setReports(prev => prev.filter(r => r.id !== id));
        } catch(error) {
            console.error("Delete failed:", error);
            alert("Failed to delete report");
        }      
    };

    return (
        <>
        <VideoBackground />
        <div className="reports-page">
            <div className="report-header">
                <h1>Reports</h1>
                <h5><p>View and manage urban analysis reports</p></h5>
                <button onClick={() => navigate("/dashboard")}><i className="fa-solid fa-arrow-left"></i> Back to Dashboard</button>
            </div>

            {reports.length === 0 ? (
                <div className="empty-state">
                    <h3>No reports found</h3>
                </div>
            ) : (
                <div className="reports-list">
                    {reports.map((report) => (
                        <div className="report-card" key={report.id}>
                            <h3>{report.area_name}</h3>

                            <p>
                                <strong>Latitude:</strong> {report.latitude} |
                                <strong> Longitude:</strong> {report.longitude}
                            </p>

                            <p>
                                <strong>Generated on:</strong>{" "}
                                {new Date(report.created_at).toLocaleString()}
                            </p>

                            <div className="report-actions">
                                <button onClick={() => navigate(`/result/${report.id}`)}>View</button>
                                <button disabled>Download</button>
                                <button onClick={() => {if (window.confirm("Delete this report ?")) handleDelete(report.id)}}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    );
};

export default Reports;