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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-1">
              Search Query
            </label>
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your customer feedback..."
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              id="include-summary"
              type="checkbox"
              checked={includeSummary}
              onChange={(e) => setIncludeSummary(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="include-summary" className="ml-2 block text-sm text-gray-700">
              Include AI Summary
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`w-full px-4 py-2 rounded-md text-white font-medium
                      ${isLoading || !query.trim()
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {summary && (
        <div className="border-t border-gray-200 px-6 py-4 bg-blue-50">
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Summary</h3>
          <div className="prose max-w-none">
            {summary.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2">{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="border-t border-gray-200">
          <h3 className="px-6 py-3 bg-gray-50 text-lg font-medium text-gray-900">
            Relevant Feedback ({results.length})
          </h3>
          <ul className="divide-y divide-gray-200">
            {results.map((item, index) => (
              <li key={index} className="px-6 py-4">
                <div className="flex justify-between">
                  <div className="flex-grow">
                    <p className="text-sm text-gray-900 mb-1">{item.text}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(item.metadata).map(([key, value]) => (
                        <span
                          key={key}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {Math.round(item.similarity * 100)}% match
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isLoading && hasSearched && results.length === 0 && !error && (
        <div className="px-6 py-4 text-center text-gray-500">
          No results found for your query. Try a different question.
        </div>
      )}
    </div>
  );
}

export default ChatInterface;