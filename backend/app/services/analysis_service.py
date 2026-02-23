from sqlalchemy.orm import Session
from datetime import datetime

from app.services.ai_services import extract_intent, get_coordinates
from app.services.feasibility_services import calculate_feasibility
from app.services.report_services import generate_report

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

    #If query is provided → use AI extraction
    if query:
        category_id, city = extract_intent(query)
        latitude, longitude = get_coordinates(city)
        area_name = city

    if not all([category_id, latitude, longitude]):
        raise ValueError("Missing required analysis parameters.")

    #Run Feasibility Engine
    feasibility_data = calculate_feasibility(
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
        "commercial_index": 0,      # placeholder (add later if needed)
        "growth_rate": 0,           # placeholder (add later if needed)
        "competition_count": feasibility_data.get("competition_count"),
        "competition_score": feasibility_data.get("competition_score"),
        "population_score": feasibility_data.get("population_score"),
        "income_score": feasibility_data.get("income_score"),
        "final_score": feasibility_data.get("total_score"),
        "area_rating": feasibility_data.get("area_rating"),
    }

    #Generate Report Text
    report_text = generate_report(db, analysis_data)

    #Save Report to analysis_reports Table
    new_report = AnalysisResult(
        user_id=user_id,
        latitude=latitude,
        longitude=longitude,
        area_name=analysis_data["area_name"],
        category_id=category_id,
        analysis_text=report_text
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # 6️⃣ Return Response
    return {
        "analysis_id": new_report.id,
        "area_name": analysis_data["area_name"],
        "category_id": category_id,
        "latitude": latitude,
        "longitude": longitude,
        "final_score": analysis_data["final_score"],
        "area_rating": analysis_data["area_rating"],
        "report_text": report_text
    }
