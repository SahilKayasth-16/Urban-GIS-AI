import React, { useState } from "react";
import "../styles/LayersPanel.css";

const layers = [
    {id: "roads-layer", label: "Roads"},
    {id: "rail-layer", label: "Railways"},
    {id: "landuse-layer", label: "Landuse"},
    {id: "water-layer", label: "Water Supply"},
    {id: "power-layer", label: "Electricity"},
];

const LayersPanel = ({ activeLayers, onToggleLayer, onClose }) => {
    const handleChange = (id) => {
        const next = !activeLayers[id];
        onToggleLayer(id, next);
    };

    return(
        <>
        <div className="layers-panel" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
                <h4>📚 Layers</h4>
                <button className="close-btn" onClick={onClose}>✖</button>
            </div>

            <div className="layers-list">
                {layers.map(layer => (
                    <label key={layer.id} className="layer-item">
                        <input 
                            type="checkbox" 
                            checked={!!activeLayers[layer.id]} 
                            onChange={() => handleChange(layer.id)} 
                        />
                        <span className="checkbox-custom"></span>
                        {layer.label}
                    </label>
                ))}
            </div>
        </div>
        </>
    );
};

export default LayersPanel;