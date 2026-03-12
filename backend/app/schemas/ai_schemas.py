from pydantic import BaseModel

from typing import Optional

class ChatRequest(BaseModel):
    query: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    area_name: Optional[str] = None
