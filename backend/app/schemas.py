from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MessageResponse(BaseModel):
    message_id: str
    message: str
    reply: Optional[str] = None
    user_id: str
    context: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

class MessagesListResponse(BaseModel):
    messages: List[MessageResponse]
