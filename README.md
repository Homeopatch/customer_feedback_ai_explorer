# AI-Enhanced Customer Feedback Explorer

An end-to-end full-stack application that ingests customer feedback data, processes it into a vectorized format, and provides an interactive chat interface for exploring insights using an LLM.

## Project Structure

```
project_root/
├── backend/                # FastAPI backend
│   ├── app/                # Application code
│   │   ├── api/            # API endpoints
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Dockerfile
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   └── App.js          # Main application component
│   ├── package.json        # Node.js dependencies
│   └── Dockerfile          # Frontend Dockerfile
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # Project documentation
```

## Features

- Data ingestion from CSV files containing customer feedback
- Batch processing of embeddings for improved performance
- Vector embeddings for semantic search using OpenAI's embedding API
- Interactive chat interface for querying feedback data
- LLM-powered insights and summaries
- Responsive UI built with React and Tailwind CSS
- Containerized deployment with Docker

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- OpenAI API key

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd customer_feedback_ai_explorer

   ```

2. Create a `.env` file in the root directory:
   ```
   cp backend/.env.example backend/.env
   ```

3. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Build and start the containers:
   ```
   docker compose up -d --build
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Usage

1. Upload a CSV file containing customer feedback data using the upload form.
   - You can adjust the batch size for processing (larger batches are faster but use more memory)
   - The default batch size of 32 works well for most datasets
2. Wait for the data to be processed - you'll see progress information during processing.
3. Once the data is processed, use the chat interface to ask questions about the feedback.
4. View the AI-generated summaries and relevant feedback entries.

## Architecture Overview

The application follows a modern full-stack architecture:

### Backend (FastAPI)

- **API Layer**: RESTful endpoints for data ingestion and querying
- **Service Layer**: Business logic for embedding generation, vector storage, and LLM integration
- **Vector Store**: In-memory FAISS index for efficient similarity search

### Frontend (React)

- **Component-Based UI**: Modular React components for file upload and chat interface
- **State Management**: React hooks for local state management
- **API Integration**: Axios for communication with the backend

### Data Flow

1. User uploads CSV file with customer feedback
2. Backend processes the data and generates embeddings using OpenAI's API
3. Embeddings are stored in a FAISS vector index
4. User submits natural language queries
5. Queries are converted to embeddings and used for similarity search
6. Relevant feedback is retrieved and optionally summarized by an LLM
7. Results are displayed in the UI

## Key Design Decisions

1. **In-Memory Vector Store**: FAISS was chosen for its efficiency and simplicity, avoiding the need for a separate database service.

2. **OpenAI Integration**: Using OpenAI's embedding and completion APIs provides high-quality results with minimal implementation effort.

3. **Batch Processing**: Embeddings are generated and stored in batches to significantly improve performance and reduce API costs.

4. **Containerization**: Docker ensures consistent deployment across environments and simplifies setup.

5. **Separation of Concerns**: Clear separation between frontend and backend allows for independent scaling and development.

6. **Responsive UI**: Tailwind CSS provides a modern, responsive design with minimal custom CSS.

## Future Development

To make this solution production-ready, consider the following enhancements:

1. **Authentication & Authorization**: Implement user authentication and role-based access control.

2. **Persistent Storage**: Replace the in-memory vector store with a persistent database like Pinecone, Weaviate, or Milvus.

4. **Caching**: Implement caching for common queries to reduce API costs and improve performance.

5. **Monitoring & Logging**: Add comprehensive logging and monitoring for production use.

6. **Testing**: Implement unit and integration tests for both frontend and backend.

7. **CI/CD Pipeline**: Set up automated testing and deployment workflows.

8. **Rate Limiting & Throttling**: Protect the API from abuse and manage costs.

9. **Advanced Analytics**: Add visualization of feedback trends and sentiment analysis.

10. **Multi-Model Support**: Allow switching between different embedding and LLM providers.