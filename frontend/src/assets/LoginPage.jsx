import React, { useState} from "react";
import "../styles/LoginPage.css";
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";

const LoginPage = () => {
    const [ username, setUsername ] = useState("");

    const [ password, setPassword ] = useState("");

    const navigate = useNavigate();

    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            alert("All fields are required");
            return;
        }

        try {
            const apiBase = "http://127.0.0.1:8000"; // Consistently use IP to match common browser behavior
            const res =  await fetch(`${apiBase}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username, 
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Login Failed. " || data.detail);
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            
            login({
                username: data.user.username,
                role: data.user.role 
            });

            if (data.user.role === ROLES.ADMIN) {
                navigate("/admindashboard");
            } 
            else if (data.user.role === ROLES.BUSINESS_OWNER) {
                navigate("/business/dashboard");
            }
            else {
                navigate("/userdashboard");
            }
            
        } catch(error) {
            alert("Server error.");
            console.error(error);
        }
}

    return (
        <div className="login-page">
            <AppHeader />
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Welcome Back</h1>
                        <p>Login to your Urban GIS AI account</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text" 
                                id="username"
                                placeholder="Enter your username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                id="password"
                                placeholder="Enter your password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="login-options">
                            <label className="remember-me">
                                <input type="checkbox" /> Remember me
                            </label>
                            <Link to="/changepassword" title="Change Password" className="forgot-password">
                                Forgot password?
                            </Link>
                        </div>
                
                        <button type="submit" className="login-btn">Sign In</button>

                        <div className="login-footer">
                            <p>
                                Don't have an account? <Link to="/registration">Sign up now</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;