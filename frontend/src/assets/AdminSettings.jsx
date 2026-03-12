import React, { useState } from "react";
import axios from "axios";
import { ROLES } from "../constants/roles";
import { useNavigate } from "react-router-dom";
import VideoBackground from "../components/VideoBackground";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminSettings.css";

const AdminSettings = () => {
    const { user, login } = useAuth(); // Assuming login helps update the user context
    const navigate = useNavigate();
    const userr = JSON.parse(localStorage.getItem("user"));
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

            setMessage({ type: "success", text: "Profile updated successfully! Server is restarting to apply changes..." });
            setFormData({ ...formData, password: "", confirmPassword: "" });
            
            // Update the local auth context with new token and user
            if (response.data.token && response.data.user) {
                login(response.data.token, response.data.user);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            const errorMessage = error.response?.data?.detail || (error.code === "ERR_NETWORK" ? "Network error: Server might be restarting. Please wait a moment." : "Error updating profile.");
            setMessage({ type: "error", text: errorMessage });
        } finally {
            setLoading(false);
        }

    };

    const handleMoveToDashboard = () => {
        if (user?.role === ROLES.ADMIN) {
          navigate("/admindashboard");
        } else {
          navigate("/userdashboard");
        }
    }
    return (
        <>
        <VideoBackground />
        <div className="admin-settings-container">
            <h1>Admin Settings</h1>
            <div className="settings-card">
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
                        <label htmlFor="password">New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>

            <div>
        <button onClick={handleMoveToDashboard}>
          <i className="fa-solid fa-arrow-left"></i> Back to dashboard
        </button>
        </div>
        </div>
        </>
    );
};

export default AdminSettings;
