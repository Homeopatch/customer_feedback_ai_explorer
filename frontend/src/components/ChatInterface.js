import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function ChatInterface() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [conversation, setConversation] = useState([]);

  const handleChat = async () => {
    if (!query.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    // Add user message to conversation
    const userMessage = {
      type: 'user',
      content: query
    };

    setConversation(prev => [...prev, userMessage]);

    try {
      const response = await axios.post(`${API_URL}/query`, {
        query: query.trim(),
        top_k: 5,
        generate_summary: true
      });

      setResults(response.data.results);
      setSummary(response.data.summary);

      // Add AI response to conversation
      const aiMessage = {
        type: 'ai',
        content: response.data.summary,
        sources: response.data.results
      };

      setConversation(prev => [...prev, aiMessage]);

      // Clear the input field
      setQuery('');
    } catch (err) {
      console.error('Query error:', err);
      setError(
        err.response?.data?.detail ||
        'An error occurred while processing your query. Please try again.'
      );

      // Add error message to conversation
      const errorMessage = {
        type: 'error',
        content: err.response?.data?.detail ||
                'An error occurred while processing your query. Please try again.'
      };

      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleChat();
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col h-[700px]">
      {/* Chat messages area with sources section */}
      <div className="flex-grow overflow-y-auto flex flex-col">
        {/* Main chat area */}
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          {conversation.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-6">
              <svg className="h-12 w-12 mx-auto text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="none" />
                <path d="M8 10.5H8.01M16 10.5H16.01M9 16.2C9.5 16.7 10.5 17.2 12 17.2C13.5 17.2 14.5 16.7 15 16.2M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="text-lg font-medium mb-2">Chat with your feedback data</h3>
              <p className="max-w-sm">
                Ask questions about your customer feedback and get AI-powered insights based on the data.
              </p>
            </div>
          ) : (
            conversation.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-3/4 rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : message.type === 'error'
                        ? 'bg-red-100 text-red-800 rounded-bl-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.type === 'ai' ? (
                    <div>
                      <div className="prose prose-sm max-w-none">
                        {message.content.split('\n').map((paragraph, idx) => (
                          paragraph.trim() ? (
                            <p key={idx} className="mb-2 last:mb-0">{paragraph}</p>
                          ) : null
                        ))}
                      </div>

                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs font-medium text-gray-500 mb-2">
                            Based on {message.sources.length} relevant feedback items
                          </div>

                          <div className="space-y-2">
                            {message.sources.slice(0, 2).map((source, sourceIdx) => (
                              <div key={sourceIdx} className="text-xs bg-white p-2 rounded border border-gray-200">
                                <div className="flex justify-between mb-1">
                                  <div className="font-medium">
                                    {source.metadata.reviewerName || "Anonymous"}
                                  </div>
                                  <div className="text-yellow-500">
                                    {source.metadata.overall && (
                                      <span>
                                        {"★".repeat(Math.floor(source.metadata.overall))}
                                        {"☆".repeat(5 - Math.floor(source.metadata.overall))}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-gray-700 line-clamp-2">{source.text}</p>
                              </div>
                            ))}

                            {message.sources.length > 2 && (
                              <button
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                onClick={() => {
                                  // Scroll to the sources section
                                  document.getElementById('sources-section')?.scrollIntoView({
                                    behavior: 'smooth'
                                  });
                                }}
                              >
                                View all {message.sources.length} sources
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg rounded-bl-none p-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Sources section - now inside the scrollable area */}
        {results.length > 0 && (
          <div className="border-t border-gray-200" id="sources-section">
            <h3 className="px-6 py-3 bg-gray-50 text-lg font-medium text-gray-900 flex items-center sticky top-0">
              <svg className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="none" />
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Source Feedback ({results.length})
            </h3>
            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
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
      </div>

      {/* Input area - fixed at bottom */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about your customer feedback..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-full shadow-sm
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`px-4 py-2 rounded-full text-white font-medium flex items-center justify-center
                      transition-colors duration-200
                      ${isLoading || !query.trim()
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" fill="none" />
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatInterface;