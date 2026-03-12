from pydantic import BaseModel
from datetime import datetime

class ChatCreate(BaseModel):
    message: str

class chatResponse(BaseModel):
    id: int
    role: str 
    message: str
    created_at: datetime

    class config:
        orm_mode = True