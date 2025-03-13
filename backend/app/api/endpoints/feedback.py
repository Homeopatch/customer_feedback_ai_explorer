import logging
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Query
from app.services.vector_store import VectorStore
from app.services.embedding_service import EmbeddingService
import pandas as pd
import io

router = APIRouter()
logger = logging.getLogger('MyProject')

# Dependency to get vector store instance
def get_vector_store():
    return VectorStore.get_instance()

# Dependency to get embedding service instance
def get_embedding_service():
    return EmbeddingService.get_instance()

@router.post("/feedback/ingest")
async def ingest_feedback(
    file: UploadFile = File(...),
    batch_size: int = Query(32, description="Number of texts to process in each batch"),
    vector_store: VectorStore = Depends(get_vector_store),
    embedding_service: EmbeddingService = Depends(get_embedding_service)
):
    """
    Ingest customer feedback data from a CSV file and store embeddings in the vector store.

    The data is processed in batches to improve performance.

    Args:
        file: CSV file containing feedback data
        batch_size: Number of texts to process in each batch (default: 32)
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    try:
        # Read CSV content
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))

        # Validate required columns
        required_columns = ['reviewText']  # Add other required columns as needed
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {', '.join(missing_columns)}"
            )

        # Filter out rows with empty or NaN reviewText
        df = df[df['reviewText'].notna() & (df['reviewText'].str.strip() != '')]

        # Process the data in batches
        total_rows = len(df)
        processed_count = 0

        logger.info(f"Starting to process {total_rows} feedback entries in batches of {batch_size}")

        # Process in batches
        for i in range(0, total_rows, batch_size):
            batch_df = df.iloc[i:i+batch_size]

            # Extract texts and prepare metadata for the batch
            texts = []
            metadata_list = []

            for _, row in batch_df.iterrows():
                text = row['reviewText']
                metadata = {col: row[col] for col in df.columns if col != 'reviewText' and not pd.isna(row[col])}
                texts.append(text)
                metadata_list.append(metadata)

            if not texts:
                continue

            # Generate embeddings for the batch
            logger.debug(f"Generating embeddings for batch of {len(texts)} texts...")
            embeddings = embedding_service.get_embeddings_batch(texts)

            # Store embeddings in vector database
            logger.debug(f"Storing batch of {len(texts)} embeddings...")
            vector_store.add_embeddings_batch(embeddings, texts, metadata_list)

            processed_count += len(texts)
            logger.info(f"Processed {processed_count}/{total_rows} entries")

        return {
            "message": f"Successfully processed {processed_count} feedback entries",
            "total_entries": total_rows,
            "processed_entries": processed_count
        }

    except Exception as e:
        logger.error(f"Error processing file: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")