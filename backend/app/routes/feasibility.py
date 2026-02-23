from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.feasibility_services import calculate_feasibility, get_competition_analysis

router = APIRouter()

#================ BUSINESS FEASIBILITY ENGINE ===============#
@router.post("/feasibility")
def check_feasibility(data: dict, db: Session = Depends(get_db)):
    result = calculate_feasibility(
        db,
        data["latitude"],
        data["longitude"],
        data["category_id"]
    )
    return result

#=============== COMPETITON ANALYSIS QUERY ===============#
@router.post("/competition")
def competiton_analysis(data: dict, db:Session = Depends(get_db)):
    result = get_competition_analysis(
        db,
        data["latitude"],
        data["longitude"],
        data["category_id"]
    )
    return result
