import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.logging_config import setup_logging

# Configure logging
log_level = os.getenv("LOG_LEVEL", "INFO")
logger = logging.getLogger('MyProject')
setup_logging(logger, log_level=log_level)


app = FastAPI(title="Customer Feedback Explorer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Customer Feedback Explorer API"}

# Import and include routers
from app.api.endpoints import feedback, query

app.include_router(feedback.router, prefix="/api", tags=["feedback"])
app.include_router(query.router, prefix="/api", tags=["query"])
