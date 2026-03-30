import React, { useState } from "react";
import axios from "axios";
import { ROLES } from "../constants/roles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppHeader from "../components/AppHeader";
import "../styles/AdminSettings.css";

const AdminSettings = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: user?.username || "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put("http://localhost:8000/auth/update-profile", {
                username: formData.username,
                password: formData.password || undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setFormData({ ...formData, password: "", confirmPassword: "" });
            
            if (response.data.token && response.data.user) {
                login(response.data.token, response.data.user);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: "error", text: "Failed to update profile." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page-wrapper">
            <AppHeader />
            <div className="admin-container">
                <div className="admin-header">
                    <div>
                        <h1>Account Settings</h1>
                        <p>Update your administrative credentials and profile information.</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => navigate(user?.role === ROLES.ADMIN ? "/admindashboard" : "/userdashboard")}>
                        <i className="fa-solid fa-arrow-left"></i> Dashboard
                    </button>
                </div>

                <div className="settings-grid">
                    <div className="settings-card">
                        <div className="card-header">
                            <h3><i className="fa-solid fa-user-gear"></i> Profile Security</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="settings-form">
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">New Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Leave blank to keep current"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Re-type new password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}

                            <button type="submit" className="btn btn-primary save-btn" disabled={loading}>
                                {loading ? "Updating..." : "Save Profile Changes"}
                            </button>
                        </form>
                    </div>

                    <div className="settings-info-card">
                        <h3>System Status</h3>
                        <div className="status-item">
                            <span>Auth Server</span>
                            <span className="dot online"></span>
                        </div>
                        <div className="status-item">
                            <span>GIS Engine</span>
                            <span className="dot online"></span>
                        </div>
                        <div className="status-item">
                            <span>Database</span>
                            <span className="dot online"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
