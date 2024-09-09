import random

async def generate_reply(message: str) -> str:
    # Replace with an actual AI model call if needed
    replies = [
        "I'm just a simple bot, but I hear you!",
        "That sounds interesting!",
        "Tell me more!",
        "I'm here to help!",
        "Can you explain that a bit further?"
    ]
    return random.choice(replies)
