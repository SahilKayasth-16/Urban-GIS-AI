import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ROLES } from "../constants/roles";
import { useAuth } from "../context/AuthContext";
import AppHeader from "../components/AppHeader";
import "../styles/UserManagement.css";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://127.0.0.1:8000/admin/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u.id !== userId));
            alert("User deleted successfully.");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert(error.response?.data?.detail || "Error deleting user.");
        }
    };

    const handleBack = () => {
        if (user?.role === ROLES.ADMIN) {
          navigate("/admindashboard");
        } else {
          navigate("/userdashboard");
        }
    }

    if (loading) return <div className="loading-screen">Loading Geospatial Personnel...</div>;

    return (
        <div className="admin-page-wrapper">
            <AppHeader />
            <div className="admin-container">
                <div className="admin-header">
                    <div>
                        <h1>User Management</h1>
                        <p>Configure access control and manage personnel profiles.</p>
                    </div>
                    <button className="btn btn-secondary" onClick={handleBack}>
                        <i className="fa-solid fa-arrow-left"></i> Dashboard
                    </button>
                </div>

                <div className="table-card">
                    <div className="table-responsive">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>Personnel ID</th>
                                    <th>Username</th>
                                    <th>Email Access</th>
                                    <th>Auth Status</th>
                                    <th>Organization Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td className="id-cell">#00{u.id}</td>
                                        <td className="user-cell">
                                            <div className="user-avatar">{u.username.charAt(0).toUpperCase()}</div>
                                            <span>{u.username}</span>
                                        </td>
                                        <td>{u.email}</td>
                                        <td><span className="status-indicator active">Verified</span></td>
                                        <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                                        <td>
                                            <button 
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="btn-icon delete"
                                                disabled={u.id === currentUser?.id}
                                                title="Revoke Access"
                                            >
                                                <i className="fa-solid fa-user-slash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
