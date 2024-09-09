from fastapi import FastAPI
from app.api.routes import router as message_router

app = FastAPI()


app.include_router(message_router, prefix="/api")
