import React from "react";
import { Link } from "react-router-dom";
import "../styles/AppFooter.css";
import logo from "../assets/image/urban_gis_ai_logo.png";

const AppFooter = () => {
    return (
        <footer className="app-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <Link to="/" className="logo-section">
                        <img src={logo} alt="Urban GIS AI" className="logo-img" />
                        <span className="logo-text">Urban<span>GIS</span> AI</span>
                    </Link>
                    <p className="footer-description">
                        Revolutionizing urban planning with AI-powered geospatial intelligence and real-time data analytics.
                    </p>
                    <div className="social-links">
                        <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
                        <a href="https://www.linkedin.com/in/sahil-kayasth-388bb2228?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin"></i></a>
                        <a href="https://github.com/SahilKayasth-16" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>
                    </div>
                </div>

                <div className="footer-links">
                    <div className="link-group">
                        <h4>Platform</h4>
                        <Link to="/mapview">GIS Mapping</Link>
                        <Link to="/analytics">Analytics</Link>
                        <Link to="/reports">Reports</Link>
                    </div>
                    <div className="link-group">
                        <h4>Company</h4>
                        <Link to="/about">About Us</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/privacy">Privacy Policy</Link>
                    </div>
                    <div className="link-group">
                        <h4>Resources</h4>
                        <Link to="/help">Help Center</Link>
                        <Link to="/docs">Documentation</Link>
                        <Link to="/api">API Reference</Link>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Urban GIS AI. All rights reserved.</p>
                <div className="footer-status">
                    <span className="status-dot"></span>
                    Systems Operational
                </div>
            </div>
        </footer>
    );
};

export default AppFooter;
