import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function FileUpload({ onDataLoaded }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);
  const [batchSize, setBatchSize] = useState(32);
  const [processingStats, setProcessingStats] = useState(null);
  const [vectorStoreStats, setVectorStoreStats] = useState(null);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/status`);
      setVectorStoreStats(response.data.vector_store);
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  };

  // Fetch status on component mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      if (fileExtension === 'csv') {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError('Please select a valid CSV file');
      }
    } else {
      setFile(null);
      setError('Please select a valid CSV file');
    }
  };

  const handleBatchSizeChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setBatchSize(value);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading file and processing data...');
    setError(null);
    setProcessingStats(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('batch_size', batchSize);

    try {
      const response = await axios.post(`${API_URL}/feedback/ingest`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus(`Success! ${response.data.message}`);
      setProcessingStats({
        total: response.data.total_entries,
        processed: response.data.processed_entries
      });

      // Fetch updated status
      await fetchStatus();

      onDataLoaded();
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.detail ||
        'An error occurred while uploading the file. Please try again.'
      );
      setUploadStatus(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold flex items-center text-gray-800">
          <svg className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" fill="none" />
            <path d="M7 16.0002C5.34315 16.0002 4 14.657 4 13.0002C4 11.7683 4.83481 10.7254 6 10.2677C6 7.91104 7.79086 6.00018 10 6.00018C12.2091 6.00018 14 7.91104 14 10.2677C15.1652 10.7254 16 11.7683 16 13.0002C16 14.657 14.6569 16.0002 13 16.0002M12 10.0002V20.0002M12 10.0002L15 13.0002M12 10.0002L9 13.0002"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Upload Customer Feedback
        </h2>

        {vectorStoreStats && (
          <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md text-sm flex items-center">
            <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" fill="none" />
              <path d="M19 8H5M19 8C20.1046 8 21 8.89543 21 10V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V10C3 8.89543 3.89543 8 5 8M19 8V6C19 4.89543 18.1046 4 17 4H7C5.89543 4 5 4.89543 5 6V8M10 12H14"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">{vectorStoreStats.total_entries}</span> entries in database
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 hover:file:text-blue-800
                        focus:outline-none"
              disabled={isUploading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" fill="none" />
                  <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch Size
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={batchSize}
              onChange={handleBatchSizeChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isUploading}
            />
            <p className="mt-1 text-xs text-gray-500 flex items-center">
              <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="none" />
                <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Larger batch sizes process faster but use more memory. Recommended: 16-64
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                        transition-colors duration-200 flex items-center justify-center
                        ${!file || isUploading
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" fill="none" />
                    <path d="M4 16V17C4 18.6569 5.34315 20 7 20H17C18.6569 20 20 18.6569 20 17V16M16 8L12 4M12 4L8 8M12 4V16"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Upload and Process Data
                </>
              )}
            </button>

            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2 flex items-center">
                  <svg className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" fill="none" />
                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  This may take several minutes for large files. Please be patient.
                </p>
              </div>
            )}
          </div>

          {uploadStatus && (
            <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-md border border-green-100">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" fill="none" />
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-medium">{uploadStatus}</span>
              </div>
              {processingStats && (
                <div className="mt-2 text-sm bg-white p-3 rounded border border-green-100">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Total entries:</span> {processingStats.total}
                    </div>
                    <div>
                      <span className="font-medium">Processed:</span> {processingStats.processed}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;