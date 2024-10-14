// src/HomePage.js
import React from 'react';
import FileUpload from './FileUpload';
import CurrentResult from './CurrentResult';
import Sidebar from './Sidebar';

function HomePage({
  selectedFile,
  setSelectedFile,
  handleFileUpload,
  currentResult,
  uniqueTexts,
  filter,
  setFilter,
  togglePurchased,
  isLoading,
  errorMessage
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row flex-grow bg-gray-100">
        {/* Main Content (Left Side) */}
        <div className="flex-1 p-8">
          <div className="flex flex-col space-y-6">
            {/* File Upload */}
            <FileUpload
              handleFileChange={(file) => setSelectedFile(file)}
              handleFileUpload={() => handleFileUpload(selectedFile)}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />

            {/* Current Result */}
            <CurrentResult currentResult={currentResult} />
          </div>
        </div>

        {/* Sidebar (Right Side) */}
        <div className="w-1/3 bg-white shadow-lg p-6">
          <Sidebar
            uniqueTexts={uniqueTexts}
            filter={filter}
            setFilter={setFilter}
            togglePurchased={togglePurchased}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;