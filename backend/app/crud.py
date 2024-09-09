from app.database import db
from app.models import MessageCreate, MessageResponse, MessageUpdate
from bson.objectid import ObjectId
from datetime import datetime, timezone
from pymongo import ReturnDocument
from pymongo.errors import PyMongoError

from app.utils.ai import generate_reply

messages_collection = db["messages"]


async def create_message(message_data: MessageCreate) -> MessageResponse:
    try:
        message_dict = message_data.model_dump()
        message_dict["created_at"] = datetime.now(timezone.utc).isoformat()
        message_dict["updated_at"] = None
        message_dict["deleted_at"] = None
        result = await messages_collection.insert_one(message_dict)

        # Fetch the newly inserted document
        inserted_document = await messages_collection.find_one({"_id": result.inserted_id})
        if inserted_document:
            message_dict["id"] = str(inserted_document["_id"])
            return MessageResponse(**message_dict)
        else:
            raise RuntimeError("Error fetching the inserted document.")

    except PyMongoError as e:
        # Handle exception or log error
        raise RuntimeError(f"Error creating message: {e}")


async def get_messages(user_id: int, context: str, skip_count:int) -> list[MessageResponse]:
    try:
        messages = await messages_collection.find(
            {"user_id": user_id, "context": context}
        ).sort("created_at", -1).skip(skip_count).limit(20).to_list(length=20)
        
        return [MessageResponse(**{**msg, "id": str(msg["_id"])}) for msg in messages]
    except PyMongoError as e:
        # Handle exception or log error
        raise RuntimeError(f"Error retrieving messages: {e}")


async def update_message(message_id: str, update_data: MessageUpdate) -> MessageResponse:
    try:
        update_data = update_data.model_dump(exclude_unset=True)
        
        if 'message' in update_data:
            reply = await generate_reply(update_data['message'])
            update_data["reply"] = reply
            update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
            
        result = await messages_collection.find_one_and_update(
            {"_id": ObjectId(message_id)},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER,
        )
        if not result:
            return None
        return MessageResponse(**result, id=str(result["_id"]))
    except PyMongoError as e:
        # Handle exception or log error
        raise RuntimeError(f"Error updating message: {e}")


async def delete_message(message_id: str) -> bool:
    try:
        result = await messages_collection.update_one(
            {"_id": ObjectId(message_id)}, {"$set": {"deleted_at": datetime.now(timezone.utc).isoformat()}}
        )
        return result.modified_count > 0
    except PyMongoError as e:
        # Handle exception or log error
        raise RuntimeError(f"Error deleting message: {e}")
