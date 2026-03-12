from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.chat import ChatMessage
from app.schemas.chat import ChatCreate
from app.routes.auth import get_current_user

router = APIRouter()

#================= SAVE CHAT + GENERATE AI RESPONSE ==================#
@router.post("/chat")
def send_message(chat: ChatCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):

    #to save user message
    if current_user.id != 0:
        user_msg = ChatMessage(user_id = current_user.id, role = "user", message = chat.message)
        db.add(user_msg)
        db.commit()

    #to call ollama
    import requests

    response = requests.post("http://127.0.0.1:11434/api/generate",
                             json = {
                                 "model": "phi3:latest",
                                 "prompt": chat.message,
                                 "stream": False
                             },
                             timeout=60)
    
    bot_reply = response.json()["response"]

    if current_user.id != 0:
        bot_msg = ChatMessage(
            user_id = current_user.id,
            role = "bot",
            message = bot_reply
        ) 
        db.add(bot_msg)
        db.commit()

    return {"response": bot_reply}

#================= GET CHAT HISTORY =================#
@router.get("/chat/history")
def get_chat_history(db: Session = Depends(get_db), current_user = Depends(get_current_user)):

    if current_user.id == 0:
        return []

    messages = db.query(ChatMessage)\
        .filter(ChatMessage.user_id == current_user.id)\
        .order_by(ChatMessage.created_at)\
        .all()
    
    return messages