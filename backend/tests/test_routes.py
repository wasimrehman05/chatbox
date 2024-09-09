import pytest
from httpx import ASGITransport, AsyncClient
from fastapi import FastAPI
from app.main import app  # Adjust the import to match your app's location

@pytest.fixture(scope="session")
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client

@pytest.mark.asyncio(loop_scope="session")
async def test_create_new_message(client: AsyncClient):
    response = await client.post("/api/messages", json={
        "message": "Hello, World!",
        "user_id": 12345,
        "context": "onboarding"
    })
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["message"] == "Hello, World!"
    assert data["user_id"] == 12345
    assert data["context"] == "onboarding"


@pytest.mark.asyncio(loop_scope="session")
async def test_read_messages(client: AsyncClient):
    response = await client.get("/api/messages", params={
        "user_id": 12345,
        "context": "onboarding",
        "page_number": 1
    })
    assert response.status_code == 200
    data = response.json()
    assert "messages" in data
    assert isinstance(data["messages"], list)

@pytest.mark.asyncio(loop_scope="session")
async def test_update_existing_message(client: AsyncClient):
    response = await client.post("/api/messages", json={
        "message": "Update this message",
        "user_id": 12345,
        "context": "onboarding"
    })
    assert response.status_code == 200
    created_message = response.json()
    message_id = created_message["id"]

    update_response = await client.put(f"/api/messages/{message_id}", json={
        "message": "Updated message content"
    })
    assert update_response.status_code == 200
    updated_message = update_response.json()
    assert updated_message["message"] == "Updated message content"

@pytest.mark.asyncio(loop_scope="session")
async def test_delete_existing_message(client: AsyncClient):
    # Create a message to be deleted
    response = await client.post("/api/messages", json={
        "message": "Message to be deleted",
        "user_id": 12345,
        "context": "onboarding"
    })
    assert response.status_code == 200
    created_message = response.json()
    message_id = created_message["id"]

    # Delete the created message
    delete_response = await client.delete(f"/api/messages/{message_id}")
    assert delete_response.status_code == 200
    assert delete_response.json() == True  # Ensure this reflects a successful delete

    # Verify deletion
    response = await client.get("/api/messages", params={
        "user_id": 12345,
        "context": "onboarding",
        "skip_count": 0
    })
    assert response.status_code == 200
    data = response.json()
    messages = data["messages"]

    # Debug output
    print("Messages after deletion:", messages)

    # Ensure the deleted message is not present
    # assert not any(msg["id"] == message_id for msg in messages), f"Message with id {message_id} was not deleted."
    assert all(msg["deleted_at"] is not None for msg in messages if msg["id"] == message_id), f"Message with id {message_id} was not deleted."
