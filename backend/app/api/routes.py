from fastapi import APIRouter, HTTPException
from app.models import (
    MessageCreate,
    MessageUpdate,
    MessageResponse,
    MessagesListResponse,
)
from app.crud import create_message, get_messages, update_message, delete_message
from app.utils.ai import generate_reply

router = APIRouter()


@router.post("/message", response_model=MessageResponse)
async def create_new_message(message: MessageCreate):
    reply = await generate_reply(message.message)
    message_data = message.model_copy(update={"reply": reply})
    return await create_message(message_data)


@router.get("/messages", response_model=MessagesListResponse)
async def read_messages(user_id: int, context: str, page_number: int = 1):
    messages = await get_messages(user_id, context, page_number)
    return MessagesListResponse(messages=messages)


@router.put("/message/{message_id}", response_model=MessageResponse)
async def update_existing_message(message_id: str, update_data: MessageUpdate):

    updated_message = await update_message(message_id, update_data)

    return updated_message


@router.delete("/message/{message_id}", response_model=bool)
async def delete_existing_message(message_id: str):
    success = await delete_message(message_id)
    if not success:
        raise HTTPException(status_code=404, detail="Message not found")
    return success
