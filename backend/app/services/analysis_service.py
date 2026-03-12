from sqlalchemy.orm import Session
from datetime import datetime

from app.services.ai_services import extract_intent, get_coordinates
from app.services.feasibility_services import (calculate_feasibility, get_competition_analysis)
from app.services.report_services import generate_report
from app.services.llm_service import generate_report_recommendation

from app.models.analysis_result import AnalysisResult  # adjust import if needed


def run_analysis_services(
    db: Session,
    user_id: int,
    query: str = None,
    category_id: int = None,
    latitude: float = None,
    longitude: float = None,
    area_name: str = None
):
    """
    Main Analysis Orchestrator

    Can work in 2 modes:
    1. Direct Mode → category_id + lat/lng provided
    2. Chat Mode → natural language query provided
    """

    # If query is provided and location not provided → use AI extraction
    if query:
        detected_category, detected_city = extract_intent(query)
        if category_id is None:
            category_id = detected_category
        if latitude is None or longitude is None:
            latitude, longitude = get_coordinates(detected_city)
        if area_name is None:
            area_name = detected_city

    if not all([category_id, latitude, longitude]):
        raise ValueError("Missing required analysis parameters.")

    #Run Feasibility Engine
    feasibility_data = calculate_feasibility(
        db=db,
        lat=latitude,
        lon=longitude,
        category_id=category_id
    )

    competition_data = get_competition_analysis(
    db=db,
    lat=latitude,
    lon=longitude,
    category_id=category_id
)

    # Prepare Analysis Data for Report
    analysis_data = {
        "area_name": area_name or "Selected Area",
        "category_id": category_id,
        "population_density": feasibility_data.get("population_density"),
        "average_income": feasibility_data.get("average_income"),
        "commercial_index": feasibility_data.get("commercial_index", 0),
        "growth_rate": feasibility_data.get("growth_rate", 0),
        "competition_count": feasibility_data.get("competition_count"),
        "competition_score": feasibility_data.get("competition_score"),
        "population_score": feasibility_data.get("population_score"),
        "income_score": feasibility_data.get("income_score"),
        "final_score": feasibility_data.get("total_score"),
        "area_rating": feasibility_data.get("area_rating"),

        "competition_details": competition_data
    }

    #Generate AI recommendations
    ai_recommendation = generate_report_recommendation(analysis_data)
    print(f"DEBUG: AI Recommendation Generated: {ai_recommendation[:50]}...")

    #Generate Report Text
    report_text = generate_report(db, analysis_data, recommendation=ai_recommendation)

    #Save Report to analysis_reports Table
    new_report = AnalysisResult(
        user_id=user_id,
        latitude=latitude,
        longitude=longitude,
        area_name=analysis_data["area_name"],
        category_id=category_id,
        analysis_text=report_text,
        result_data={
            "metrics": feasibility_data,
            "competition_details": competition_data
        }
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return {
        "analysis_id": new_report.id,
        "area_name": analysis_data["area_name"],
        "category_id": category_id,
        "latitude": latitude,
        "longitude": longitude,
        "final_score": analysis_data["final_score"],
        "area_rating": analysis_data["area_rating"],
        "report_text": report_text,

        "competition_details": competition_data
    }
