import React from "react";
import "../styles/LocationInfo.css";

const LocationInfo = ({ location }) => {
    if (!location) {
        return (
            <div className="location-info empty">
                <div className="info-icon">
                    <i className="fa-solid fa-map-pin"></i>
                </div>
                <p>Select a location on a map to see details.</p>
            </div>
        );
    }

    return (
        <div className="location-info compact">
            <div className="info-header-compact">
                <i className="fa-solid fa-location-dot"></i>
                <span className="info-label">Selected:</span>
            </div>
            
            <div className="info-content-compact">
                <div className="info-item-compact">
                    <span className="label">Name:</span>
                    <span className="value" title={location.name || "Unknown Location"}>
                        {location.name || "Unknown Location"}
                    </span>
                </div>
                <div className="info-divider"></div>
                <div className="info-item-compact">
                    <span className="label">Lat:</span>
                    <span className="value">
                        {location.latitude !== undefined ? `${location.latitude.toFixed(4)}°` : "--"}
                    </span>
                </div>
                <div className="info-divider"></div>
                <div className="info-item-compact">
                    <span className="label">Long:</span>
                    <span className="value">
                        {location.longitude !== undefined ? `${location.longitude.toFixed(4)}°` : "--"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LocationInfo;