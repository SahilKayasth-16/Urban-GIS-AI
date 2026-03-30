import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/AppHeader.css";
import logo from "../assets/image/urban_gis_ai_logo.png";
import { useAuth } from "../context/AuthContext";

const AppHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isAuthPage = ["/login", "/registration"].includes(location.pathname);

    return (
        <header className={`app-header ${scrolled ? "scrolled" : ""} glass-effect`}>
            <div className="header-container">
                <Link to="/" className="logo-section">
                    <img src={logo} alt="Urban GIS AI" className="logo-img" />
                    <span className="logo-text">Urban<span>GIS</span> AI</span>
                </Link>

                <nav className="nav-links">
                    <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
                    <Link 
                        to="/"
                        onClick={(e) => {
                            if (location.pathname === "/") {
                                e.preventDefault();
                                document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth" });
                            } else {
                                // If not on home, let the Link navigate to / first
                                // The scroll will happen on the home page via a useEffect or similar if we want it automatic
                                // But for now, just navigating to / is fine, or we can use a small delay
                                setTimeout(() => {
                                    document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth" });
                                }, 100);
                            }
                        }} 
                        className={location.pathname === "/about" ? "active" : ""}
                    >
                        About Us
                    </Link>
                    {/* <Link to="/mapview" className={location.pathname === "/mapview" ? "active" : ""}>GIS Tools</Link> */}
                    <Link to="/analytics" className={location.pathname === "/analytics" ? "active" : ""}>Analytics</Link>
                </nav>

                <div className="header-actions">
                    {!isAuthPage && (
                        <>
                            {user ? (
                                <button onClick={handleLogout} className="btn-login" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-login">Login</Link>
                                    <Link to="/registration" className="btn-primary">Get Started</Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
