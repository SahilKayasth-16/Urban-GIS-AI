import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const { user } = useAuth();
    const [selectedLocation, setSelectedLocationState] = useState(null);
    const [competitors, setCompetitorsState] = useState([]);

    // Load location and competitors when user changes
    useEffect(() => {
        if (user) {
            const savedLocation = localStorage.getItem(`selectedLocation_${user.username}`);
            if (savedLocation) {
                setSelectedLocationState(JSON.parse(savedLocation));
            } else {
                setSelectedLocationState(null);
            }

            const savedCompetitors = localStorage.getItem(`competitors_${user.username}`);
            if (savedCompetitors) {
                setCompetitorsState(JSON.parse(savedCompetitors));
            } else {
                setCompetitorsState([]);
            }
        } else {
            // Clear state on logout
            setSelectedLocationState(null);
            setCompetitorsState([]);
        }
    }, [user]);

    const setSelectedLocation = (location) => {
        setSelectedLocationState(location);
        if (user) {
            const key = `selectedLocation_${user.username}`;
            if (location) {
                localStorage.setItem(key, JSON.stringify(location));
            } else {
                localStorage.removeItem(key);
            }
        }
    };

    const setCompetitors = (competitorData) => {
        setCompetitorsState(competitorData);
        if (user) {
            const key = `competitors_${user.username}`;
            if (competitorData && competitorData.length > 0) {
                localStorage.setItem(key, JSON.stringify(competitorData));
            } else {
                localStorage.removeItem(key);
            }
        }
    };

    const clearLocation = () => {
        setSelectedLocationState(null);
        setCompetitorsState([]);
        if (user) {
            localStorage.removeItem(`selectedLocation_${user.username}`);
            localStorage.removeItem(`competitors_${user.username}`);
        }
    };

    return (
        <LocationContext.Provider value={{ 
            selectedLocation, 
            setSelectedLocation, 
            competitors, 
            setCompetitors, 
            clearLocation 
        }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error("useLocation must be used within a LocationProvider");
    }
    return context;
};
