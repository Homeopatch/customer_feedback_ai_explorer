import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function FileUpload({ onDataLoaded }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);
  const [batchSize, setBatchSize] = useState(32);
  const [processingStats, setProcessingStats] = useState(null);

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
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Customer Feedback Data</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
          disabled={isUploading}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Batch Size (number of texts to process at once)
        </label>
        <input
          type="number"
          min="1"
          max="100"
          value={batchSize}
          onChange={handleBatchSizeChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isUploading}
        />
        <p className="mt-1 text-xs text-gray-500">
          Larger batch sizes process faster but use more memory. Recommended: 16-64
        </p>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${!file || isUploading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
      >
        {isUploading ? 'Processing...' : 'Upload and Process Data'}
      </button>

      {isUploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This may take several minutes for large files. Please be patient.
          </p>
        </div>
      )}

      {uploadStatus && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md">
          <p>{uploadStatus}</p>
          {processingStats && (
            <div className="mt-2 text-sm">
              <p>Total entries: {processingStats.total}</p>
              <p>Processed entries: {processingStats.processed}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;