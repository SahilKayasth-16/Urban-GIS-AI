import React from "react"; 
import BusinessSidebar from "../components/BusinessSidebar"; 
import AppHeader from "../components/AppHeader";
import "../styles/Process.css"; 

const Process = () => { 
    const steps = [
        { title: "Application Submission", desc: "Submit your business details and geospatial coordinates for review." },
        { title: "Document Verification", desc: "Our analysts verify legal documentation and business category alignment." },
        { title: "GIS Feasibility Check", desc: "AI algorithms assess the urban impact and environmental feasibility." },
        { title: "Authority Review", desc: "Final human-in-the-loop review by urban planning authorities." },
        { title: "Activation", desc: "Upon approval, your business is live on the Urban GIS AI platform." }
    ];

    return ( 
        <div className="business-page-wrapper"> 
            <AppHeader />
            <div className="business-layout"> 
                <BusinessSidebar /> 
                <div className="business-content"> 
                    <div className="section-header">
                        <h2>Approval Pipeline</h2>
                        <p>Transparency in urban business integration and scaling.</p>
                    </div>

                    <div className="process-timeline"> 
                        {steps.map((step, index) => (
                            <div className="timeline-item" key={index}>
                                <div className="step-number">{index + 1}</div>
                                <div className="step-content">
                                    <h3>{step.title}</h3>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div> 
                </div> 
            </div> 
        </div> 
    ); 
}; 

export default Process;