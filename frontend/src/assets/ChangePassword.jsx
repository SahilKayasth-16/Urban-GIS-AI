import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ChangePassword.css";
import AppHeader from "../components/AppHeader";

const ChangePassword = () => {
    const [ username, setUsername ] = useState("");

    const [ oldPassword, setOldPassword ] = useState("");

    const [ newPassword, setNewPassword ] = useState("");

    const [ confirmPassword, setConfirmPassword ] = useState("");

    const navigate = useNavigate();
    
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!username || !oldPassword || !newPassword || !confirmPassword) {
            alert("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/auth/change-password", {
                method: "POST",
                headers: { "Content-Type":"application/json" },
                body: JSON.stringify({
                    username,
                    old_password: oldPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Failed to change password" || data.detail);
                return;
            }

            alert("Password updated successfully.");
            navigate("/login");

        } catch(error) {
            console.error(error);
            alert("Server error")
        }
    };

    return (
        <div className="change-password-page">
            <AppHeader />
            <div className="change-password-container">
                <div className="change-password-card">
                    <div className="change-password-header">
                        <h1>Change Password</h1>
                        <p>Secure your account with a new password</p>
                    </div>

                    <form onSubmit={handleChangePassword} className="change-password-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text" 
                                id="username" 
                                value={username} 
                                placeholder="Enter your username" 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>

                        <div className="form-group">
                            <label>Old Password</label>
                            <input 
                                type="password" 
                                value={oldPassword} 
                                onChange={(e) => setOldPassword(e.target.value)} 
                                placeholder="Enter current password" 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password">New Password</label>
                            <input 
                                type="password" 
                                id="new_password" 
                                value={newPassword} 
                                placeholder="Create new password" 
                                onChange={(e) => setNewPassword(e.target.value)} 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password">Confirm New Password</label>
                            <input 
                                type="password" 
                                id="confirm_password" 
                                value={confirmPassword} 
                                placeholder="Re-type new password" 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                            />
                        </div>

                        <button type="submit" className="change-password-btn btn-primary">Update Password</button>

                        <div className="change-password-footer">
                            <p>
                                Remembered your password? <Link to="/login">Back to Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;