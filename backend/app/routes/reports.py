from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.models.analysis_result import AnalysisResult
from app.services.analysis_service import run_analysis_services
from datetime import datetime

import json

router = APIRouter()

class ReportRequest(BaseModel):
    user_id: int
    latitude: float
    longitude: float
    category_id: int
    area_name: str

#=============== GENERATE REPORT API ===============#
@router.post("/generate-report")
def create_report(data: ReportRequest, db: Session = Depends(get_db)):
    result = run_analysis_services(
        db=db,
        user_id=data.user_id,
        latitude=data.latitude,
        longitude=data.longitude,
        category_id=data.category_id,
        area_name=data.area_name
    )

    return {
        "message": "Report generated successfully.",
        "report_id": result["analysis_id"],
        "analysis_result": {
            "metrics": result.get("metrics"),
            "recommendation": result.get("report_text")
        }
    }

#================= NEW API FOR ANALYSIS REPORT ====================#
@router.get("/report/{report_id}")
def get_report(report_id: int, db: Session = Depends(get_db)):
    result = db.query(AnalysisResult).filter(AnalysisResult.id == report_id).first()

    if not result:
        return {"error": "Report not found"}
    
    return {
        "id": result.id,
        "user_id": result.user_id,
        "target_area": result.area_name,
        "target_category": result.category_id,
        "latitude": result.latitude,
        "longitude": result.longitude,
        "analysis_result": {
            "metrics": result.result_data.get("metrics") if result.result_data else None,
            "competition_details": result.result_data.get("competition_details") if result.result_data else None,
            "recommendation": result.analysis_text
        },
        "created_at": result.created_at
    }

#================= DELETE REPORT ====================#
@router.delete("/report/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):

    result = db.execute(
        text("DELETE FROM analysis_results WHERE id = :id RETURNING id"),
        {"id": report_id}
    ).fetchone()

    if not result:
        return {"error": "Report not found"}

    db.commit()

    return {"message": "Report deleted successfully"}