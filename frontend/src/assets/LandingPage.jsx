import React from "react";
import "../styles/LandingPage.css";
import { Link } from 'react-router-dom';
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const LandingPage = () => {
    return (
        <div className="landing-page">
            <AppHeader />
            
            <main className="content-wrapper">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-badge">AI-Powered Geospatial Analysis</div>
                    <h1>Smart Urban Planning with AI-Powered GIS</h1>
                    <h3>Transform your workflow with intelligent geospatial analytics and data-driven insights.</h3>
                    <p className="hero-description">
                        Our platform combines advanced GIS mapping with AI-driven chatbot assistance to help you make informed decisions for utility management and sustainable urban development.
                    </p>
                    <div className="hero-actions">
                        <Link to="/registration" className="btn-primary">Get Started Now</Link>
                        <Link to="/mapview" className="btn-secondary">Explore Live Map</Link>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <div className="section-header">
                        <h2>Advanced Platform Features</h2>
                        <p>Powerful tools designed for modern urban environments</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon"><i className="fa-solid fa-location-dot"></i></div>
                            <h3>Interactive GIS Mapping</h3>
                            <p>Visualize complex spatial data with our high-performance interactive maps and custom layers.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><i className="fa-regular fa-comments"></i></div>
                            <h3>AI Chatbot Assistant</h3>
                            <p>Query your GIS data naturally with our integrated AI assistant that helps interpret complex patterns.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><i className="fa-regular fa-file-lines"></i></div>
                            <h3>Comprehensive Reports</h3>
                            <p>Generate detailed automated reports with one click to share findings with stakeholders.</p>
                        </div>
                    </div>
                </section>

                {/* Usefulness Section */}
                <section id="about-us" className="benefits-section">
                    <div className="benefits-content">
                        <h2>Why UrbanGIS AI?</h2>
                        
                        <div className="benefit-item">
                            <h3><i className="fa-solid fa-city"></i> For Urban Planners</h3>
                            <ul>
                                <li>Streamline utility infrastructure planning</li>
                                <li>Analyze geographic constraints in real-time</li>
                                <li>Optimize resource allocation effectively</li>
                                <li>Monitor urban expansion with historical data</li>
                            </ul>
                        </div>

                        <div className="benefit-item">
                            <h3><i className="fa-solid fa-user-tie"></i> For Decision Makers</h3>
                            <ul>
                                <li>Data-driven policy recommendations</li>
                                <li>Real-time spatial analysis for quick responses</li>
                                <li>Track development trends and ROI</li>
                                <li>Enhance collaboration across departments</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="benefits-visual glass-effect">
                        <img 
                            src="Urban Planning With Utility Management System.png" 
                            alt="Urban Planning With Utility Management System" 
                            className="benefits-img"
                        />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section hero-section" style={{padding: '100px 40px', background: 'var(--bg-surface)'}}>
                    <h2>Ready to Build ?</h2>
                    <p className="hero-description">Join hundreds of urban planners using our platform.</p>
                    <Link to="/registration" className="btn-primary">Create Your Account</Link>
                </section>
            </main>

            <AppFooter />
        </div>
    );
}

export default LandingPage;
