import React, { useEffect, useState } from "react";
import axios  from "axios";
import VideoBackground from "./VideoBackground";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const BusinessHeatmap = () => {
    const [ map, setMap ] = useState(null);

    useEffect(() => {
        const m = new maplibregl.Map({
            container: "heatmap-container",
            style: "https://tiles.openfreemap.org/styles/liberty",
            center: [72.5714, 23.0225],
            zoom: 11
        });

        setMap(m);
    }, []);

    useEffect(() => {
        if (!map) return;

        axios.get("http://localhost:8000/analytics/business-heatmap")
             .then((res) => {
                const features = res.data.map((p) => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [p.lng, p.lat],
                    },
             }));

             map.on("load", async () => {
                const res = await axios.get("http://localhost:8000/analytics/business-heatmap");

                const features = res.data.map((p) => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [p.lng, p.lat],
                    },
                }));

                map.addSource("business", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: features,
                    },
                });

                map.addLayer({
                    id: "business-heat",
                    type: "heatmap",
                    source: "business",
                    paint: {
                        "heatmap-intensity": 1,
                        "heatmap-radius": 20,
                        "heatmap-opacity": 0.8,
                    },
                });
             });

            }). catch(console.error);
    }, [map]);
    
    return (
        <div>
            <h3>Business Density Map</h3>
            <div id="heatmap-container" style={{ height: "400px", borderRadius: "10px"}}></div>
        </div>
    );
};

export default BusinessHeatmap;