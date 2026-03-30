import { useState  } from "react";
import "../styles/MapToolsPanel.css";

const MapToolsPanel = ({ onStyleChange }) => {
    const [ showDropDown, setShowDropDown ] = useState(false);

    return (
        <div className="map-tools-panel" onClick={(e) => e.stopPropagation()}>
            <div className="tool-item">
                <button 
                    className={`tool-btn-main ${showDropDown ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setShowDropDown(prev => !prev) }}
                >
                    <i className="fa-solid fa-map"></i>
                    <span>Base Map</span>
                    <i className={`fa-solid fa-chevron-${showDropDown ? 'down' : 'up'} arrow`}></i>
                </button>

                {showDropDown && (
                    <div className="map-dropdown">
                        <div className="dropdown-title">Select View</div>
                        <div className="dropdown-options">
                            <button className="dropdown-item" onClick={() => { onStyleChange("street"); setShowDropDown(false); }}>
                                <i className="fa-solid fa-road"></i> Street
                            </button>
                            <button className="dropdown-item" onClick={() => { onStyleChange("light"); setShowDropDown(false); }}>
                                <i className="fa-solid fa-sun"></i> Light
                            </button>
                            <button className="dropdown-item" onClick={() => { onStyleChange("dark"); setShowDropDown(false); }}>
                                <i className="fa-solid fa-moon"></i> Dark
                            </button>
                            <button className="dropdown-item" onClick={() => { onStyleChange("satellite"); setShowDropDown(false); }}>
                                <i className="fa-solid fa-satellite"></i> Satellite
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapToolsPanel;