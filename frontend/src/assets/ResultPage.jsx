import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import "../styles/ResultPage.css";
import ReportGraph from "../components/ReportGraph";
import AppHeader from "../components/AppHeader";

const AnalysisResult = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resultId) return;

    const fetchResult = async () => {
      setLoading(true);
      setResult(null); // Clear previous result immediately
      try {
        const res = await axios.get(
          `http://localhost:8000/report/${resultId}`
        );
        setResult(res.data);
      } catch (error) {
        console.error("Error fetching result:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);


  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/report/${resultId}`
      );
      navigate("/userdashboard");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleBack = () => {
    navigate("/userdashboard");
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("report-content");
    const originalStyle = element.style.cssText;
    
    // PDF optimization styles: scale to ~A4 width perfectly
    element.style.width = "790px";
    element.style.padding = "20px";
    element.style.background = "#ffffff"; 

    const opt = {
      margin: 10,
      filename: `Urban_GIS_AI_Report_${resultId}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 790
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    document.body.classList.add("generating-pdf");

    html2pdf().set(opt).from(element).save().then(() => {
      element.style.cssText = originalStyle;
      document.body.classList.remove("generating-pdf");
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!result) return <div className="loading">Result not found</div>;

  return (
    <div className="result-page">
      <AppHeader />
      <div className="result-container">
        <div className="result-card" id="report-content">
          <div className="result-header">
            <div className="header-badge">GEOSPATIAL INSIGHTS</div>
            <h1>AI Analysis Report</h1>
            <p className="subtitle">Detailed synthesis of urban metrics and geospatial intelligence</p>
            
            <div className="report-meta">
              <div className="meta-item">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <span className="label">Target Area</span>
                  <span className="value">{result.target_area}</span>
                </div>
              </div>
              <div className="meta-item">
                <i className="fa-solid fa-calendar"></i>
                <div>
                  <span className="label">Date Generated</span>
                  <span className="value">{new Date(result.created_at).toLocaleString()}</span>
                </div>
              </div>
              {result.latitude && (
                <div className="meta-item">
                  <i className="fa-solid fa-map"></i>
                  <div>
                    <span className="label">Coordinates</span>
                    <span className="value">{Number(result.latitude).toFixed(4)}, {Number(result.longitude).toFixed(4)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="section-card">
            <h2><i className="fa-solid fa-chart-line"></i> Area Metrics</h2>
            {result.analysis_result?.metrics && (
              <div className="metrics-grid">
                {Object.entries(result.analysis_result.metrics).map(([key, value]) => {
                  if (key.includes("score")) return null;
                  return (
                    <div key={key} className="metric-item">
                      <span className="metric-label">{key.replaceAll("_", " ")}</span>
                      <span className="metric-value">
                        {typeof value === "number" ? value.toLocaleString() : value}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="section-card ai-recommendations">
            <h2><i className="fa-solid fa-robot"></i> AI Recommendations</h2>
            <div className="recommendations-list">
              {result.analysis_result?.recommendation
                ?.split("\n")
                .map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;

                  return (
                    <div key={i} className="recommendation-card">
                      <i className="fa-solid fa-circle-check"></i>
                      <p>{trimmed.replace(/^[-•\d.]+\s*/, '')}</p>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="section-card graphs-section">
            <h2><i className="fa-solid fa-chart-bar"></i> Visual Analytics</h2>
            <ReportGraph
              key={resultId}
              metrics={result.analysis_result?.metrics}
              competition_details={result.analysis_result?.competition_details}
            />
          </div>

        </div> {/* End of report-content */}

        <div className="result-actions no-print">
          <button className="btn back-btn" onClick={handleBack}>
            <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
          </button>
          <div className="action-right">
            <button className="btn download-btn" onClick={handleDownloadPDF}>
              <i className="fa-solid fa-file-pdf"></i> Download PDF
            </button>
            <button className="btn delete-btn" onClick={handleDelete}>
              <i className="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
