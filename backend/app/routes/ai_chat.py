from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
from app.schemas.ai_schemas import ChatRequest
from app.services.analysis_service import run_analysis_services
from app.services.llm_service import generate_ai_response
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.analysis_result import AnalysisResult
from app.models.chat import ChatMessage

import httpx
import json
import re
import anyio

router = APIRouter()

#================= ANALYSIS OF CHAT ===================#
@router.post("/chat-analysis")
def chat_analysis(request: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    result = run_analysis_services(
        db=db,
        user_id=current_user.id,
        query=request.query
    )

    ai_reply = generate_ai_response(
        request.query,
        result
    )

    return {
        "analysis": result,
        "ai_response": ai_reply
    }

#===============REPORT INTENT CHECK ================#
def is_report_requested(text: str) -> bool:
            triggers = [
                "generate report", "create report", 
                "full report", "detailed report", 
                "export report", "download report", 
                "show report", "give report", 
                "give me report"
            ]
            text = text.lower()
            return any(t in text for t in triggers)

def is_decision_query(text: str) -> bool:
    triggers = [
        "good decision", "should i", "is it good", 
        "is it feasible", "is it worth", "worth opening",
        "better to", "recommend", "suggestion", "is it a good idea"
    ]
    text = text.lower()
    return any(t in text for t in triggers)

#================= CHAT STREAM API =================#
@router.post("/chat-stream")
async def chat_stream(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = request.query

    # Run sync analysis in threadpool
    analysis_result = await run_in_threadpool(
        run_analysis_services,
        db=db,
        user_id=current_user.id,
        query=query,
        latitude=request.latitude,
        longitude=request.longitude,
        area_name=request.area_name
    )

    # Simplified prompt for streaming - we'll handle the report logic separately
    # so the LLM can just focus on the conversational part if it's not a report request.
    
    report_requested = is_report_requested(query)
    
    if report_requested:
        prompt = f"""
        You are an Urban Planning Decision Support AI.
        User Query: {query}
        GIS Analysis Data: {analysis_result}
        
        The user wants a report. Confirm this professionally in 1 sentence.
        Output ONLY the confirmation sentence. No JSON. No markdown.
        """
    else:
        prompt = f"""
        You are an Urban Planning Decision Support AI for the Urban GIS AI platform.
        User Query: {query}
        Verified GIS Analysis Data: {analysis_result}

        OBJECTIVE:
        Provide a very concise, structured pointwise response (max 5-6 lines total) directly addressing the query.
        Follow these rules:
        - Use Verified Analysis Data to directly answer.
        - Format as a list of bullet points.
        - No introductory or concluding paragraphs.
        - Be professional and data-driven.
        - Do NOT use JSON or markdown headers.
        - No emojis.
        """

    payload = {
        "model": "phi3:latest",
        "prompt": prompt,
        "stream": True,
        "options": {
            "temperature": 0.3
        }
    }

    async def generate():
        full_text = ""
        try:
            # Save user message
            user_msg = ChatMessage(user_id=current_user.id, role="user", message=query)
            db.add(user_msg)
            await run_in_threadpool(db.commit)

            async with httpx.AsyncClient(timeout=60.0) as client:
                async with client.stream("POST", "http://127.0.0.1:11434/api/generate", json=payload) as response:
                    if response.status_code != 200:
                        yield "AI Service error. Please try again."
                        return

                    async for line in response.aiter_lines():
                        if not line: continue
                        try:
                            data = json.loads(line)
                            if "response" in data:
                                token = data["response"]
                                full_text += token
                                yield token
                        except json.JSONDecodeError:
                            continue

            # Additional flags for frontend
            if report_requested:
                report_msg = f"\n\nGenerating your detailed report now... __REPORT_LINK__:{analysis_result['analysis_id']}"
                full_text += report_msg
                yield report_msg
                yield "\n__GENERATE_REPORT__:true"
                yield f"\n__RESULT_ID__:{analysis_result['analysis_id']}"
                
                # Add competitor data to the stream
                if "competition_details" in analysis_result and "nearby_competitors" in analysis_result["competition_details"]:
                    competitors_json = json.dumps(analysis_result["competition_details"]["nearby_competitors"])
                    yield f"\n__COMPETITORS__:{competitors_json}"
            else:
                if is_decision_query(query):
                    yield "\n\n👉 Tip: Type 'Generate report' for a full detailed analysis."
                yield "\n__GENERATE_REPORT__:false"

            # Save bot message
            bot_msg = ChatMessage(user_id=current_user.id, role="bot", message=full_text)
            db.add(bot_msg)
            await run_in_threadpool(db.commit)

        except anyio.get_cancelled_exc_class():
            # Handle cancellation (e.g. user disconnects or server shuts down)
            pass
        except Exception as e:
            yield f"\nError: {str(e)}"
        finally:
            pass

    return StreamingResponse(generate(), media_type="text/plain")

#================= USER RESULTS ==================#
@router.get("/analysis/user-results")
def get_user_results(current_user: User = Depends(get_current_user),
                     db: Session = Depends(get_db)):

    results = db.query(AnalysisResult)\
                .filter(AnalysisResult.user_id == current_user.id)\
                .all()

    return results