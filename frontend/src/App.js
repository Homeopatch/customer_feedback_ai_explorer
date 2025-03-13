import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';
import StatusBadge from './components/StatusBadge';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vectorStoreStats, setVectorStoreStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/status`);
      const stats = response.data.vector_store;
      setVectorStoreStats(stats);

      // If there are entries in the vector store, set data as loaded
      if (stats.total_entries > 0) {
        setIsDataLoaded(true);
      }
    } catch (err) {
      console.error('Error fetching status:', err);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch status on component mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const handleDataLoaded = () => {
    setIsDataLoaded(true);
    // Refresh the status to get updated counts
    fetchStatus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <svg className="h-8 w-8 mr-3 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" fill="none" />
              <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Customer Feedback Explorer
          </h1>
          {vectorStoreStats && <StatusBadge stats={vectorStoreStats} />}
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading application...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg shadow-md text-red-700 text-center mx-4">
            <svg className="h-12 w-12 mx-auto mb-4 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" fill="none" />
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="px-4 py-6 sm:px-0">
            <div className="border border-gray-200 rounded-lg shadow-card bg-white overflow-hidden">
              <FileUpload onDataLoaded={handleDataLoaded} />

              {isDataLoaded && (
                <div className="mt-6 border-t border-gray-100 pt-6 px-6 pb-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" fill="none" />
                      <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Chat with your feedback data
                  </h2>
                  <ChatInterface />
                </div>
              )}

              {!isDataLoaded && (
                <div className="mt-6 border-t border-gray-100 pt-6 px-6 pb-8 text-center">
                  <svg className="h-16 w-16 mx-auto text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" fill="none" />
                    <path d="M7 16.0002C5.34315 16.0002 4 14.657 4 13.0002C4 11.7683 4.83481 10.7254 6 10.2677C6 7.91104 7.79086 6.00018 10 6.00018C12.2091 6.00018 14 7.91104 14 10.2677C15.1652 10.7254 16 11.7683 16 13.0002C16 14.657 14.6569 16.0002 13 16.0002M12 10.0002V20.0002M12 10.0002L15 13.0002M12 10.0002L9 13.0002"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-gray-600 mb-2">Upload a CSV file to start chatting with your customer feedback data.</p>
                  <p className="text-sm text-gray-500">No data found in the vector store.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Customer Feedback Explorer — AI-powered feedback analysis
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;