import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';  // No BrowserRouter here
import Header from './Header';
import Footer from './Footer';
import AuthPage from './AuthPage';
import HomePage from './HomePage';  // Import the new HomePage component
import { addRecord, getUserRecords, updatePurchaseStatus } from "./authService";
import './App.css';

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
    const storedUsername = localStorage.getItem('username');
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (storedUsername && storedAuth) {
      setUsername(storedUsername);
      setIsAuthenticated(storedAuth);
    }
  }, []);

  useEffect(() => {
    if (username) {
      const fetchRecords = async () => {
        const records = await getUserRecords(username);  // Fetch records from Firestore
        setUniqueTexts(records);  // Set the sidebar data with fetched records
      };

      fetchRecords();
    }
  }, [username]);

  const handleLoginSuccess = (username) => {
    setUsername(username);
    setIsAuthenticated(true);
    localStorage.setItem('username', username);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('username');
    localStorage.removeItem('isAuthenticated');
  };

  const updateUniqueTexts = (newTexts) => {
    setUniqueTexts((prevTexts) => {
      const allTexts = [...prevTexts];
      newTexts.forEach((newText) => {
        if (!allTexts.some((item) => item.text === newText)) {
          const newItem = { text: newText, purchased: false };
          allTexts.push(newItem);
          addRecord(username, newItem);
        }
      });
      return allTexts;
    });
  };

  const togglePurchased = (text) => {
    setUniqueTexts((prevTexts) => {
      const updatedTexts = prevTexts.map((item) => {
        if (item.text === text) {
          const updatedItem = { ...item, purchased: !item.purchased };
          updatePurchaseStatus(username, item.text, updatedItem.purchased);
          return updatedItem;
        }
        return item;
      });
      return updatedTexts;
    });
  };

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
      const res = await fetch('http://localhost:8000/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setCurrentResult(data);
      updateUniqueTexts(data);
      setSelectedFile(null);
    } catch (error) {
      setErrorMessage('Failed to upload file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header at the top */}
      <Header handleLogout={handleLogout} isAuthenticated={isAuthenticated} />

      {/* Main content area with flex-grow and overflow */}
      <main className="flex-grow overflow-y-auto">
        <Routes>
          <Route
            path="/auth"
            element={<AuthPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <HomePage
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  handleFileUpload={handleFileUpload}
                  currentResult={currentResult}
                  uniqueTexts={uniqueTexts}
                  filter={filter}
                  setFilter={setFilter}
                  togglePurchased={togglePurchased}
                  isLoading={isLoading}
                  errorMessage={errorMessage}
                />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/auth"} />} />
        </Routes>
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}

export default App;