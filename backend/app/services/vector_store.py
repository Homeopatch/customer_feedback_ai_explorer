import faiss
import numpy as np
import logging
from typing import List, Dict, Any, Optional
import threading

# Get application logger
logger = logging.getLogger('MyProject')

class VectorStore:
    _instance = None
    _lock = threading.Lock()
    
    @classmethod
    def get_instance(cls):
        with cls._lock:
            if cls._instance is None:
                logger.info("Creating new VectorStore instance")
                cls._instance = VectorStore()
            return cls._instance
    
    def __init__(self):
        # Initialize an empty index
        self.dimension = 1536  # Default for OpenAI embeddings
        self.index = None
        self.texts = []
        self.metadata_list = []
        self.initialize_index()
    
    def initialize_index(self):
        """Initialize a new FAISS index."""
        logger.info(f"Initializing FAISS index with dimension {self.dimension}")
        self.index = faiss.IndexFlatL2(self.dimension)
        self.texts = []
        self.metadata_list = []
    
    def add_embedding(self, embedding: List[float], text: str, metadata: Dict[str, Any] = None):
        """
        Add a single embedding to the vector store.

        Args:
            embedding: The vector embedding
            text: The original text
            metadata: Additional metadata to store with the embedding
        """
        if metadata is None:
            metadata = {}

        logger.debug("Adding single embedding to vector store")

        # Convert embedding to numpy array and reshape for FAISS
        embedding_np = np.array(embedding).astype('float32').reshape(1, -1)

        # Add to FAISS index
        self.index.add(embedding_np)

        # Store text and metadata
        self.texts.append(text)
        self.metadata_list.append(metadata)
    
    def add_embeddings_batch(self, embeddings: List[List[float]], texts: List[str], metadata_list: List[Dict[str, Any]] = None):
        """
        Add multiple embeddings to the vector store in a batch.

        Args:
            embeddings: List of vector embeddings
            texts: List of original texts
            metadata_list: List of metadata dictionaries
        """
        if metadata_list is None:
            metadata_list = [{} for _ in range(len(embeddings))]

        logger.debug(f"Adding batch of {len(embeddings)} embeddings to vector store")

        # Convert embeddings to numpy array
        embeddings_np = np.array(embeddings).astype('float32')

        # Add to FAISS index
        self.index.add(embeddings_np)

        # Store texts and metadata
        self.texts.extend(texts)
        self.metadata_list.extend(metadata_list)

        logger.debug(f"Vector store now contains {len(self.texts)} items")
    
    def search(self, query_embedding: List[float], k: int = 5) -> List[Dict[str, Any]]:
        """
        Search for similar embeddings in the vector store.

        Args:
            query_embedding: The query vector embedding
            k: Number of results to return

        Returns:
            List of dictionaries containing text, metadata, and similarity score
        """
        if len(self.texts) == 0:
            logger.warning("Search attempted on empty vector store")
            return []

        # Adjust k if we have fewer items than requested
        k = min(k, len(self.texts))
        logger.debug(f"Searching for top {k} matches in vector store with {len(self.texts)} items")

        # Convert query to numpy array
        query_np = np.array(query_embedding).astype('float32').reshape(1, -1)

        # Search the index
        distances, indices = self.index.search(query_np, k)

        # Format results
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.texts):  # Safety check
                similarity = float(1.0 / (1.0 + distances[0][i]))  # Convert distance to similarity score
                results.append({
                    "text": self.texts[idx],
                    "metadata": self.metadata_list[idx],
                    "similarity": similarity
                })

        logger.debug(f"Found {len(results)} matches")
        return results
    
    def clear(self):
        """Clear the vector store and reset the index."""
        self.initialize_index()