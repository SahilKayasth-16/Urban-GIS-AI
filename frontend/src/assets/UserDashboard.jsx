import React, { useState, useRef } from "react";
import { useLocation } from "../context/LocationContext";
import "../styles/DashBoard.css";
import MapView from "../components/MapView";
import ChatBotDrawer from "../components/ChatbotDrawer";
import VideoBackground from "../components/VideoBackground";
import TopBar from "../components/Top-Bar";
import SideBar from "../components/SideBar";
import LocationInfo from "../components/LocationInfo";
import MapToolsPanel from "../components/MapToolsPanel";
import LayersPanel from "../components/LayersPanel";

const UserDashboard = () => {
    const mapViewRef = useRef(null);

    const [isChatOpen, setIsChatOpen] = useState(false);

    const { selectedLocation, setSelectedLocation } = useLocation();

    const user = JSON.parse(localStorage.getItem("user"));

    const [showMapTools, setShowMapTools] = useState(false);

    const [showLayers, setShowLayers] = useState(false);
    const [activeLayers, setActiveLayers] = useState({});

    const handleToggleLayer = (id, visible) => {
        setActiveLayers(prev => ({ ...prev, [id]: visible }));
    };

    return (
        <>
            <VideoBackground />

            <div className="dashboard-layout">
                <SideBar
                    onMapViewClick={() => setShowMapTools(prev => !prev)}
                    onLayersClick={() => setShowLayers(prev => !prev)}
                />

                {showMapTools && (
                    <MapToolsPanel onStyleChange={(style) => { if (mapViewRef.current) { mapViewRef.current.changeStyle(style) } }} />
                )}

                {showLayers && (
                    <LayersPanel
                        activeLayers={activeLayers}
                        onToggleLayer={handleToggleLayer}
                        onClose={() => setShowLayers(false)}
                    />
                )}

                <div className="dashboard-main">
                    <TopBar user={user} onChatClick={() => setIsChatOpen(true)} />

                    <LocationInfo location={selectedLocation} />

                    <MapView 
                        ref={mapViewRef} 
                        onLocationSelect={setSelectedLocation} 
                        selectedLocation={selectedLocation}
                        activeLayers={activeLayers}
                    />
                </div>

                <ChatBotDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} location={selectedLocation} />
            </div>
        </>
    );
};

export default UserDashboard;