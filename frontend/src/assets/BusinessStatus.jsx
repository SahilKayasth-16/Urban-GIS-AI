import React, { useState, useEffect } from "react";
import BusinessSidebar from "../components/BusinessSidebar";
import StatusBadge from "../components/StatusBadge";
import AppHeader from "../components/AppHeader";
import "../styles/BusinessStatus.css";
import API from "../services/api";

const BusinessStatus = () => {
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        API.get("/business/my")
            .then(res => setStatuses(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="business-page-wrapper">
            <AppHeader />
            <div className="business-layout">
                <BusinessSidebar />
                <div className="business-content">
                    <div className="section-header">
                        <h2>Registration Status</h2>
                        <p>Monitor the progress of your business approval applications.</p>
                    </div>

                    <div className="status-table-container">
                        <table className="status-table">
                            <thead>
                                <tr>
                                    <th>Business Entity</th>
                                    <th>Submission Date</th>
                                    <th>Verification Path</th>
                                    <th>Current Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statuses.length > 0 ? (
                                    statuses.map((b, i) => (
                                        <tr key={i}>
                                            <td className="entity-name">{b.business_name}</td>
                                            <td>{new Date().toLocaleDateString()}</td>
                                            <td>Standard Review</td>
                                            <td><StatusBadge status={b.status} /></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="empty-row">No active submissions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessStatus;
