from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.models import user
from app.routes import (
    auth, business, admin, analytics, geocode, 
    feasibility, reports, ai_chat, chat
)

app = FastAPI()

print("Starting FastAPI with updated CORS configuration...")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(business.router)
app.include_router(admin.router)
app.include_router(analytics.router)
app.include_router(geocode.router, prefix="/api")

app.include_router(feasibility.router)
app.include_router(reports.router)
app.include_router(ai_chat.router)
app.include_router(chat.router)