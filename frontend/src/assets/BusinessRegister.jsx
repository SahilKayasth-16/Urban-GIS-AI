import React, { useState, useEffect, useRef } from "react";
import "../styles/BusinessRegister.css";
import BusinessSidebar from "../components/BusinessSidebar";
import AppHeader from "../components/AppHeader";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const BusinessRegister = () => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) return;

        const map = new maplibregl.Map({
            container: "map",
            style: "https://tiles.openfreemap.org/styles/liberty",
            center: [78.9629, 20.5937],
            zoom: 5
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        const marker = new maplibregl.Marker({ draggable: true }).setLngLat([78.9629, 20.5937]).addTo(map);

        marker.on("dragend", () => {
            const { lng, lat } = marker.getLngLat();
            setForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
        });

        map.on("click", (e) => {
            marker.setLngLat(e.lngLat);
            setForm(prev => ({ ...prev, latitude: e.lngLat.lat, longitude: e.lngLat.lng }));
        });

        mapRef.current = map;
        markerRef.current = marker;
    }, []);

    const [form, setForm] = useState({
        business_name: "",
        category_id: "",
        description: "",
        address: "",
        city: "",
        latitude: null,
        longitude: null
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.business_name || !form.category_id || !form.address || !form.city || form.latitude === null) {
            alert("Please fill all required fields & select location on map");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/business/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ ...form, category_id: Number(form.category_id) }),
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.detail || "Business registration failed.");
                return;
            }

            alert("Business submitted successfully!");
            setForm({ business_name: "", category_id: "", description: "", address: "", city: "", latitude: null, longitude: null });
            markerRef.current?.setLngLat([78.9629, 20.5937]);
        } catch (error) {
            console.error(error);
            alert("Server error.");
        }
    };

    return (
        <div className="business-page-wrapper">
            <AppHeader />
            <div className="business-layout">
                <BusinessSidebar />
                <div className="business-content">
                    <div className="section-header">
                        <h2>New Business Registration</h2>
                        <p>Fill in the details and pinpoint your location on the map.</p>
                    </div>

                    <div className="registration-grid">
                        <form className="business-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Business Name</label>
                                <input name="business_name" placeholder="E.g. Nexus Tech Hub" value={form.business_name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select name="category_id" value={form.category_id} onChange={handleChange}>
                                    <option value="">Select Category</option>
                                    <option value="2">Emergency Services</option>
                                    <option value="3">Entertainment</option>
                                    <option value="4">Food & Hospitality</option>
                                    <option value="5">Corporate & IT</option>
                                    <option value="6">Public Amenities</option>
                                    <option value="7">Automobile Services</option>
                                    <option value="8">Retail Shop</option>
                                    <option value="9">Education</option>
                                    <option value="10">Logistics</option>
                                    <option value="11">Others...</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" placeholder="Briefly describe your business..." value={form.description} onChange={handleChange} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input name="city" value={form.city} placeholder="City" onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input name="address" value={form.address} placeholder="Full Address" onChange={handleChange} />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary submit-btn">Register Business</button>
                        </form>

                        <div className="map-picker-section">
                            <label>Geospatial Pin</label>
                            <div className="map-container" id="map"></div>
                            <div className="coords-display">
                                <span>Lat: {form.latitude?.toFixed(4) || "0.0000"}</span>
                                <span>Lng: {form.longitude?.toFixed(4) || "0.0000"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessRegister;