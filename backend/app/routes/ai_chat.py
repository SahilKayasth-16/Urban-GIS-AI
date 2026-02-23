from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.ai_schemas import ChatRequest
from app.services.ai_services import extract_intent, get_coordinates
from app.services.analysis_service import run_analysis_services
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/chat-analysis")
def chat_analysis(request: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    result = run_analysis_services(
        db=db,
        user_id=current_user.id,
        query=request.query
    )

    return result
