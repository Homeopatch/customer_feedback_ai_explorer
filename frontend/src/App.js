import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const handleDataLoaded = () => {
    setIsDataLoaded(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Feedback Explorer
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 bg-white">
            <FileUpload onDataLoaded={handleDataLoaded} />
            
            {isDataLoaded && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Chat with your feedback data</h2>
                <ChatInterface />
              </div>
            )}
            
            {!isDataLoaded && (
              <div className="mt-8 text-center text-gray-500">
                <p>Upload a CSV file to start exploring your customer feedback data.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;