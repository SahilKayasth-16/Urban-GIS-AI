import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import "../styles/ResultPage.css";
import ReportGraph from "../components/ReportGraph";
import VideoBackground from "../components/VideoBackground";

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
      navigate("/dashboard");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleBack = () => {
    navigate("/userdashboard");
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("report-content");
    const opt = {
      margin: 10,
      filename: "Urban GIS AI Analysis Report.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    document.body.classList.add("generating-pdf");

    html2pdf().set(opt).from(element).save().then(() => {
      document.body.classList.remove("generating-pdf");
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!result) return <div className="loading">Result not found</div>;

  return (
    <>
      <VideoBackground />
      <div className="result-container">
        <div className="result-card" id="report-content">

          {/* PDF ONLY HEADER */}
          <div className="pdf-only-header">
            <div className="pdf-header-top">
              <h1>Urban GIS AI</h1>
              <span>Analysis Report</span>
            </div>
            <div className="pdf-header-meta">
              <p><strong>Area:</strong> {result.target_area}</p>
              <p><strong>Generated:</strong> {new Date(result.created_at).toLocaleString()}</p>
            </div>
            <hr />
          </div>

          <h2 className="screen-only">AI Analysis Report</h2>

          <div className="location-info screen-only">
            <p><strong>Area:</strong> {result.target_area}</p>
            {result.latitude && (
              <p><strong>Latitude:</strong> {Number(result.latitude).toFixed(4)}°</p>
            )}
            {result.longitude && (
              <p><strong>Longitude:</strong> {Number(result.longitude).toFixed(4)}°</p>
            )}
            <p><strong>Date:</strong> {new Date(result.created_at).toLocaleString()}</p>
          </div>

          {/* METRICS SECTION */}
          <div className="analysis-box metrics-container">
            <h3>📊 Area Metrics</h3>

            {result.analysis_result?.metrics && (
              <div className="metrics-grid">
                {Object.entries(result.analysis_result.metrics).map(([key, value]) => {
                  if (key.includes("score")) return null; // Skip scores in the grid, show them in graphs
                  return (
                    <div key={key} className="metric-item">
                      <strong>{key.replaceAll("_", " ")}:</strong> {typeof value === "number" ? value.toLocaleString() : value}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="page-break"></div>

          {/* AI RECOMMENDATIONS */}
          <div className="analysis-box recommendations-container">
            <h3>🤖 AI Recommendations</h3>
            <div className="recommendations-content">
              {result.analysis_result?.recommendation
                ?.split("\n")
                .map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;

                  if (/^\d+\./.test(trimmed)) {
                    return <p key={i} className="numbered">{trimmed}</p>;
                  }

                  if (trimmed.startsWith("-") || trimmed.startsWith("•")) {
                    return <p key={i} className="bullet">{trimmed}</p>;
                  }

                  return <p key={i}>{trimmed}</p>
                })}
            </div>
          </div>

          <div className="page-break"></div>

          <div className="graphs-section">
            <ReportGraph
              key={resultId}
              metrics={result.analysis_result?.metrics}
              competition_details={result.analysis_result?.competition_details}
            />
          </div>

          <div className="button-group no-print">
            <button className="btn back" onClick={handleBack}>
              <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
            </button>

            <button className="btn save" onClick={handleDownloadPDF}>
              Save as PDF
            </button>

            <button className="btn delete" onClick={handleDelete}>
              Delete
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AnalysisResult;
