import React, { useState} from "react";
import "../styles/LoginPage.css";
import { Link, useNavigate } from 'react-router-dom';
import VideoBackground from "../components/VideoBackground";
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
        <>
        <VideoBackground />
        <div className="main">
            <h1>Welcome Back</h1>
            <h3>Login to Urban GIS AI</h3>

            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username:</label>
                <input type="text"  placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />

                <label htmlFor="password">Password:</label>
                <input type="password" placeholder="Enter yuor password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        
                <button type="submit">Login</button>

                <h5><Link to={"/changepassword"}>Forgot / Change Password</Link></h5>
            
                <h5>
                    Haven't registered yet ? <Link to={"/registration"}>Register yourself</Link>
                </h5>
            </form>
        </div>
        </>
    );
}

export default LoginPage;