from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.vector_store import VectorStore
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5
    generate_summary: bool = True

class FeedbackItem(BaseModel):
    text: str
    metadata: Dict[str, Any]
    similarity: float

class QueryResponse(BaseModel):
    results: List[FeedbackItem]
    summary: Optional[str] = None

# Dependencies
def get_vector_store():
    return VectorStore.get_instance()

def get_embedding_service():
    return EmbeddingService.get_instance()

def get_llm_service():
    return LLMService.get_instance()

@router.post("/query", response_model=QueryResponse)
async def query_feedback(
    request: QueryRequest,
    vector_store: VectorStore = Depends(get_vector_store),
    embedding_service: EmbeddingService = Depends(get_embedding_service),
    llm_service: LLMService = Depends(get_llm_service)
):
    """
    Query the feedback database using natural language and return the most relevant results.
    Optionally generate a summary of the results using an LLM.
    """
    try:
        # Generate embedding for the query
        query_embedding = embedding_service.get_embedding(request.query)
        
        # Search for similar feedback
        search_results = vector_store.search(query_embedding, k=request.top_k)
        
        # Format results
        results = [
            FeedbackItem(
                text=item["text"],
                metadata=item["metadata"],
                similarity=item["similarity"]
            )
            for item in search_results
        ]
        
        # Generate summary if requested
        summary = None
        if request.generate_summary and results:
            feedback_texts = [item.text for item in results]
            summary = llm_service.generate_summary(request.query, feedback_texts)
        
        return QueryResponse(results=results, summary=summary)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")