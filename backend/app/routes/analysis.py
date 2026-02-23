from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.analysis_result import AnalysisResult

router = APIRouter()

@router.post("/run-analysis")
def run_analysis(data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    generated_text = "Sample Analysis output for testing"

    #AI logic
    ai_output = f"AI Analysis for {data['area_name']}..."

    result = AnalysisResult(
        user_id=current_user.id,
        latitude=data["latitude"],
        longitude=data["longitude"],
        area_name=data["area_name"],
        category_id=data["category_id"],
        analysis_text=ai_output
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    return {
        "message": "Analysis completed",
        "result_id": result.id,
        "analysis_text": generated_text
    }

#=============== GET SINGLE RESULT ===============#
@router.get("/analysis/{result_id}")
def get_analysis(result_id: int, db: Session = Depends(get_db)):
    result = db.query(AnalysisResult).filter(
        AnalysisResult.id == result_id
    ).first()

    if not result:
        return {"error": "Result not found"}

    return result

#=============== DELETE RESULT ===============#
@router.delete("/analysis/{result_id}")
def delete_analysis(result_id: int, db: Session = Depends(get_db)):

    result = db.query(AnalysisResult).filter(
        AnalysisResult.id == result_id
    ).first()

    if not result:
        return {"error": "Not found"}

    db.delete(result)
    db.commit()

    return {"message": "Deleted successfully"}
