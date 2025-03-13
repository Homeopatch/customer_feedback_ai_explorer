import logging
from fastapi import APIRouter
from app.services.vector_store import VectorStore

router = APIRouter()
logger = logging.getLogger('MyProject')

# Get service instances
vector_store = VectorStore.get_instance()

@router.get("/status")
async def get_status():
    """
    Get the current status of the vector store.
    
    Returns:
        Dictionary with status information including the number of entries.
    """
    logger.info("Getting vector store status")
    
    try:
        stats = vector_store.get_stats()
        
        return {
            "status": "ok",
            "vector_store": stats
        }
    
    except Exception as e:
        logger.error(f"Error getting status: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }