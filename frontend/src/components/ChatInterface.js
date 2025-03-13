import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function ChatInterface() {
  const [query, setQuery] = useState('');
  const [includeSummary, setIncludeSummary] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await axios.post(`${API_URL}/query`, {
        query: query.trim(),
        top_k: 5,
        generate_summary: includeSummary
      });

      setResults(response.data.results);
      setSummary(response.data.summary);
    } catch (err) {
      console.error('Query error:', err);
      setError(
        err.response?.data?.detail ||
        'An error occurred while processing your query. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <svg className="h-4 w-4 mr-1.5 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="none" />
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Search Query
            </label>
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your customer feedback..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        placeholder-gray-400"
              disabled={isLoading}
            />
          </div>

          <div className="mb-5 flex items-center">
            <input
              id="include-summary"
              type="checkbox"
              checked={includeSummary}
              onChange={(e) => setIncludeSummary(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="include-summary" className="ml-2 block text-sm text-gray-700 flex items-center">
              <svg className="h-4 w-4 mr-1 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="none" />
                <path d="M13 10V3L4 14H11V21L20 10H13Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Include AI Summary
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`w-full px-4 py-2.5 rounded-md text-white font-medium flex items-center justify-center
                      transition-colors duration-200
                      ${isLoading || !query.trim()
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" fill="none" />
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Search
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-100 flex items-start">
            <svg className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" fill="none" />
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>

      {summary && (
        <div className="border-t border-gray-200 px-6 py-5 bg-blue-50">
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <svg className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" fill="none" />
              <path d="M9.66347 17H14.3364M11.9999 3V4M18.3639 5.63604L17.6568 6.34315M21 12H20M4 12H3M6.34309 6.34315L5.63599 5.63604M8.46441 15.5356C6.51179 13.5829 6.51179 10.4171 8.46441 8.46449C10.417 6.51187 13.5829 6.51187 15.5355 8.46449C17.4881 10.4171 17.4881 13.5829 15.5355 15.5356L14.9884 16.0827C14.3555 16.7155 13.9999 17.5739 13.9999 18.469V19C13.9999 20.1046 13.1045 21 11.9999 21C10.8954 21 9.99995 20.1046 9.99995 19V18.469C9.99995 17.5739 9.6444 16.7155 9.01151 16.0827L8.46441 15.5356Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            AI Summary
          </h3>
          <div className="prose max-w-none bg-white p-4 rounded-md border border-blue-100 shadow-sm">
            {summary.split('\n').map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index} className="mb-2 last:mb-0">{paragraph}</p>
              ) : null
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="border-t border-gray-200">
          <h3 className="px-6 py-3 bg-gray-50 text-lg font-medium text-gray-900 flex items-center">
            <svg className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" fill="none" />
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Relevant Feedback ({results.length})
          </h3>
          <ul className="divide-y divide-gray-200">
            {results.map((item, index) => (
              <li key={index} className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      <div className="ml-auto flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {Math.round(item.similarity * 100)}% match
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-900 mb-3 bg-white p-3 rounded-md border border-gray-100 shadow-sm">{item.text}</p>

                    {/* Metadata Table */}
                    <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-xs font-medium text-gray-500 flex items-center">
                          <svg className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" fill="none" />
                            <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Feedback Details
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {/* Hidden IDs with tooltip */}
                        <div className="relative group cursor-help">
                          <div className="text-blue-600 underline flex items-center">
                            <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="24" height="24" fill="none" />
                              <path d="M10 6H5C3.89543 6 3 6.89543 3 8V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V8C21 6.89543 20.1046 6 19 6H14M10 6V5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5V6M10 6C10 7.10457 10.8954 8 12 8C13.1046 8 14 7.10457 14 6M9 14C9 12.8954 8.10457 12 7 12C5.89543 12 5 12.8954 5 14C5 15.1046 5.89543 16 7 16C8.10457 16 9 15.1046 9 14ZM9 14C9 15.3062 7.88071 16.4175 6.58219 16.8293C5.83456 17.0366 5 16.5271 5 15.7446V15M15 13H19M15 17H17"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            ID Information
                          </div>
                          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 w-64 z-10 shadow-lg">
                            {item.metadata.reviewerID && <div><span className="font-bold">Reviewer ID:</span> {item.metadata.reviewerID}</div>}
                            {item.metadata.asin && <div><span className="font-bold">ASIN:</span> {item.metadata.asin}</div>}
                          </div>
                        </div>

                        {/* Rating */}
                        {item.metadata.overall && (
                          <div>
                            <span className="font-medium">Rating: </span>
                            <span className="text-yellow-500">
                              {"★".repeat(Math.floor(item.metadata.overall))}
                              {"☆".repeat(5 - Math.floor(item.metadata.overall))}
                            </span>
                          </div>
                        )}

                        {/* Summary */}
                        {item.metadata.summary && (
                          <div className="col-span-2">
                            <span className="font-medium">Summary: </span>
                            {item.metadata.summary}
                          </div>
                        )}

                        {/* Reviewer Name */}
                        {item.metadata.reviewerName && (
                          <div>
                            <span className="font-medium">Reviewer: </span>
                            {item.metadata.reviewerName}
                          </div>
                        )}

                        {/* Review Date */}
                        {item.metadata.reviewTime && (
                          <div>
                            <span className="font-medium">Date: </span>
                            {item.metadata.reviewTime}
                          </div>
                        )}

                        {/* Helpfulness */}
                        {item.metadata.helpful && Array.isArray(item.metadata.helpful) && (
                          <div>
                            <span className="font-medium">Helpful: </span>
                            {item.metadata.helpful[0]} of {item.metadata.helpful[1]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isLoading && hasSearched && results.length === 0 && !error && (
        <div className="px-6 py-12 text-center text-gray-500">
          <svg className="h-12 w-12 mx-auto text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" fill="none" />
            <path d="M9.17157 16.1716C10.7337 17.7337 13.2663 17.7337 14.8284 16.1716M9 10H9.01M15 10H15.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-lg font-medium mb-1">No results found</p>
          <p>Try a different search query or upload more feedback data.</p>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;