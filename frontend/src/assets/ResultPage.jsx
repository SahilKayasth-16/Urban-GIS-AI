import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ResultPage.css";

const AnalysisResult = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/analysis/${resultId}`
      );
      setResult(res.data);
    } catch (error) {
      console.error("Error fetching result:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/analysis/${resultId}`
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleDownloadPDF = () => {
    window.print(); // Simple version
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!result) return <div className="loading">Result not found</div>;

  return (
    <div className="result-container">
      <div className="result-card">

        <h2>AI Analysis Report</h2>

        <div className="location-info">
          <p><strong>Area:</strong> {result.area_name}</p>
          <p><strong>Latitude:</strong> {Number(result.latitude).toFixed(4)}°</p>
          <p><strong>Longitude:</strong> {Number(result.longitude).toFixed(4)}°</p>
          <p><strong>Date:</strong> {new Date(result.created_at).toLocaleString()}</p>
        </div>

        <div className="analysis-box">
          {result.analysis_text}
        </div>

        <div className="button-group">
          <button className="btn back" onClick={handleBack}>
            Back to Dashboard
          </button>

          <button className="btn pdf" onClick={handleDownloadPDF}>
            Save as PDF
          </button>

          <button className="btn delete" onClick={handleDelete}>
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResult;
