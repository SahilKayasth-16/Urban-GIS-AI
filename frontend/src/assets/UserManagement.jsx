import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ROLES } from "../constants/roles";
import VideoBackground from "../components/VideoBackground";
import { useAuth } from "../context/AuthContext";
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

    if (loading) return <div className="loading">Loading Users...</div>;

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
        <div className="user-management-container">
            <h1>User Management</h1>
            <div className="table-wrapper">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Password (Hash)</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td className="password-cell" title={user.password_hash}>
                                    {user.password_hash.substring(0, 15)}...
                                </td>
                                <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                                <td>
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="delete-btn"
                                        disabled={user.id === currentUser?.id}
                                    >
                                        <i className="fa-solid fa-trash"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

export default UserManagement;
