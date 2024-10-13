import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Header';  // Import the Header
import Footer from './Footer';  // Import the Footer
import FileUpload from './FileUpload';
import CurrentResult from './CurrentResult';
import Sidebar from './Sidebar';
import AuthPage from './AuthPage';
import { addRecord, getUserRecords, updatePurchaseStatus } from "./authService"; 

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentResult, setCurrentResult] = useState([]);
  const [uniqueTexts, setUniqueTexts] = useState([]); // Sidebar data
  const [filter, setFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null); // Track the logged-in username

  // Fetch user records from Firestore on component mount
  useEffect(() => {
    if (username) {
      const fetchRecords = async () => {
        const records = await getUserRecords(username);  // Fetch records from Firestore
        setUniqueTexts(records);  // Set the sidebar data with fetched records
      };

      fetchRecords();
    }
  }, [username]);

  // Add new records to both Firestore and the sidebar
  const updateUniqueTexts = (newTexts) => {
    setUniqueTexts((prevTexts) => {
      const allTexts = [...prevTexts];

      newTexts.forEach((newText) => {
        // Check for uniqueness: if the newText is not already in the list
        if (!allTexts.some((item) => item.text === newText)) {
          const newItem = { text: newText, purchased: false };

          // Add the new unique item to the sidebar list (ALL)
          allTexts.push(newItem);

          // Add the new record to Firestore
          addRecord(username, newItem);
        }
      });

      return allTexts; // Update the sidebar state with the new ALL list
    });
  };

  // Toggle purchase status in Firestore and update sidebar
  const togglePurchased = (text) => {
    setUniqueTexts((prevTexts) => {
      const updatedTexts = prevTexts.map((item) => {
        if (item.text === text) {
          const updatedItem = { ...item, purchased: !item.purchased };

          // Update purchase status in Firestore
          updatePurchaseStatus(username, item.text, updatedItem.purchased); // Use the correct username

          return updatedItem;
        }
        return item;
      });
      return updatedTexts;
    });
  };

  // Handle file upload and process the image
  const handleFileUpload = async (file) => {
    if (!file) {
      alert('Please upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('http://localhost:5001/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      // Update current result to show on the main page
      setCurrentResult(data);

      // Update the sidebar (uniqueTexts) and save the new records in Firestore
      updateUniqueTexts(data);

      setSelectedFile(null);
    } catch (error) {
      setErrorMessage('Failed to upload file. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
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

        {/* Footer */}
        <Footer />
      </div>

      <Routes>
        {/* Authentication Route */}
        <Route path="/auth" element={<AuthPage onLoginSuccess={(username) => { 
          setUsername(username); 
          setIsAuthenticated(true); 
        }} />} />

        {/* Main App Route (requires authentication) */}
        {/* <Route
          path="/home"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/auth" />
            )
          }
        /> */}

        {/* Catch-all Route to Redirect Unauthenticated Users */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;