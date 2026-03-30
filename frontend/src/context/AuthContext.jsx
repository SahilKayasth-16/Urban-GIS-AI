import { createContext, useContext, useState } from "react";
import { ROLES } from "../constants/roles";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            return null;
        }
    });

    const login = (userData) => {
        // Clear previous session data for a fresh start
        localStorage.removeItem(`selectedLocation_${userData.username}`);
        localStorage.removeItem(`competitors_${userData.username}`);
        
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData);
    };

    const logout = () => {
        if (user) {
            localStorage.removeItem(`selectedLocation_${user.username}`);
        }
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);