import React, { useState } from "react";
import "../styles/RegistrationPage.css";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";

const RegistrationPage = () => {
    const [ username, setName ] = useState("");

    const [ email, setEmail ] = useState("");

    const [ createPass, setCreatePass ] = useState("");

    const [ confirmPass, setConfirmPass ] = useState("");

    const [ role, setRole ] = useState("user");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !email || !createPass || !confirmPass) {
            alert("Please fill all fields.");
            return;
        }

        if (createPass !== confirmPass) {
            alert("Passwords do not match.");
        }

        try {
            const res = await fetch("http://localhost:8000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password: createPass,
                    role: role
                })
            });

            const data = await res.json();

            if (!role) {
                alert("Please select a role first");
                return;
            }

            if (!res.ok) {
                alert("Registration Failed" || data.detail);
                return;
            }

            alert("Registration completed successfully. Please Login");
            navigate("/login");

        } catch(error) {
            console.error(error);
            alert("Server error. Please try again later.")
        }
    };

    return (
        <div className="registration-page">
            <AppHeader />
            <div className="registration-container">
                <div className="registration-card">
                    <div className="registration-header">
                        <h1>Create Account</h1>
                        <p>Join UrbanGIS AI and start planning smarter cities</p>
                    </div>

                    <form onSubmit={handleRegister} className="registration-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input 
                                    type="text" 
                                    id="username"
                                    placeholder="Choose a username" 
                                    value={username} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email"
                                    placeholder="email@example.com" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="role">Register as</label>
                                <select 
                                    id="role"
                                    value={role} 
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="user">User / Citizen</option>
                                    <option value="business_owner">Business Owner</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="create_password">Password</label>
                                <input 
                                    type="password" 
                                    id="create_password"
                                    placeholder="Create password" 
                                    value={createPass} 
                                    onChange={(e) => setCreatePass(e.target.value)} 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm_password">Confirm Password</label>
                                <input 
                                    type="password" 
                                    id="confirm_password"
                                    placeholder="Verify password" 
                                    value={confirmPass} 
                                    onChange={(e) => setConfirmPass(e.target.value)} 
                                />
                            </div>
                        </div>
                            
                        <button type="submit" className="registration-btn">Create Account</button>
                        
                        <div className="registration-footer">
                            <p>
                                Already have an account? <Link to="/login">Log in here</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegistrationPage;