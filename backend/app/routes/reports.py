from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text, bindparam
from sqlalchemy.dialects.postgresql import JSONB
from pydantic import BaseModel
from app.core.database import get_db
from app.services.feasibility_services import calculate_feasibility
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

    #running feasibilty analysis
    analysis = calculate_feasibility(
        db,
        data.latitude,
        data.longitude,
        data.category_id
    )

    #logic for AI recommendations
    if analysis["total_score"] >= 80:
        recommendations = "Perfect area with excellent business opportunity."
    elif analysis["total_score"] >= 60:
        recommendations = "Good choice of area might have moderate competitons."
    elif analysis["total_score"] >= 40:
        recommendations = "Average area, you required strategic planning."
    else:
        recommendations = "High risk area."

    #structure for result in JSON format
    analysis_result = {
        "Population Density": analysis["population_density"],
        "Average Income": analysis["average_income"],
        "Competition Count": analysis["competition_count"],
        "Competition Score": analysis["competition_score"],
        "Population Score": analysis["population_score"],
        "Income Score": analysis["income_score"],
        "Final Score": analysis["total_score"],
        "Area Rating": analysis["area_rating"],
        "Recommendation": recommendations
    }

    #query for insert into analysis_reports table
    insert_query = text("""
    INSERT INTO analysis_reports(user_id, target_category, target_area, analysis_result)
    VALUES (:user_id, :target_category, :target_area, :analysis_result)
    RETURNING id;
    """).bindparams(
            bindparam("analysis_result", type_=JSONB)
    )

    report_id = db.execute(insert_query, 
                { 
                    "user_id": data.user_id, 
                    "target_category": data.category_id, 
                    "target_area": data.area_name, 
                    "analysis_result": analysis_result }).scalar()

    db.commit()

    return {
        "message": "Report generated succesfully.",
        "report_id": report_id,
        "analysis_result": analysis_result
    }