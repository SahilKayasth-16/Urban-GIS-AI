from sqlalchemy import Column, Integer, String, Float, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    latitude = Column(Float)
    longitude = Column(Float)
    area_name = Column(String(255))
    category_id = Column(Integer)
    analysis_text = Column(Text)
    result_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())