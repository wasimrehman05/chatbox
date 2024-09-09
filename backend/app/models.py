from pydantic import BaseModel
from typing import List, Optional

class MessageCreate(BaseModel):
    message: str
    reply: Optional[str] = None
    user_id: int
    context: str

class MessageUpdate(BaseModel):
    message: str

class MessageResponse(BaseModel):
    id: str
    message: str
    reply: Optional[str] = None
    user_id: int
    context: str
    created_at: str
    updated_at: Optional[str] = None
    deleted_at: Optional[str] = None

class MessagesListResponse(BaseModel):
    messages: List[MessageResponse]
