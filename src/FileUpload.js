import React from 'react';

function FileUpload({ handleFileChange, handleFileUpload, isLoading, errorMessage }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-8 mb-6 w-full md:w-2/3">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload an Image</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleFileUpload(); }}>
        <div className="mb-4">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e.target.files[0])} 
            disabled={isLoading} 
            className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading} 
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'}`}
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {isLoading && <p className="text-gray-500 mt-4">Processing image...</p>}
      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
    </div>
  );
}

export default FileUpload;