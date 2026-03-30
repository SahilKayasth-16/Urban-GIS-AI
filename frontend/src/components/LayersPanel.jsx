import React, { useState } from "react";
import "../styles/LayersPanel.css";

const layers = [
    {id: "roads-layer", label: "Roads", icon: "fa-road"},
    {id: "rail-layer", label: "Railways", icon: "fa-train"},
    {id: "landuse-layer", label: "Landuse", icon: "fa-draw-polygon"},
    {id: "water-layer", label: "Water Supply", icon: "fa-droplet"},
    {id: "power-layer", label: "Electricity", icon: "fa-bolt"},
];

const LayersPanel = ({ activeLayers, onToggleLayer }) => {
    const [showDropDown, setShowDropDown] = useState(false);

    const handleChange = (id) => {
        onToggleLayer(id, !activeLayers[id]);
    };

    return (
        <div className="layer-tools-panel" onClick={(e) => e.stopPropagation()}>
            <div className="tool-item">
                <button 
                    className={`tool-btn-main ${showDropDown ? 'active' : ''}`}
                    onClick={() => setShowDropDown(prev => !prev)}
                >
                    <i className="fa-solid fa-layer-group"></i>
                    <span>Layers</span>
                    <i className={`fa-solid fa-chevron-${showDropDown ? 'down' : 'up'} arrow`}></i>
                </button>

                {showDropDown && (
                    <div className="layers-dropdown">
                        <div className="dropdown-title">Select Layers</div>
                        <div className="dropdown-options">
                            {layers.map(layer => (
                                <div key={layer.id} className="dropdown-item checkbox-item" onClick={() => handleChange(layer.id)}>
                                    <div className="item-content">
                                        <i className={`fa-solid ${layer.icon}`}></i>
                                        <span>{layer.label}</span>
                                    </div>
                                    <div className={`checkbox-custom-new ${activeLayers[layer.id] ? 'checked' : ''}`}>
                                        {activeLayers[layer.id] && <i className="fa-solid fa-check"></i>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LayersPanel;