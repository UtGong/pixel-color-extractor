import React, { useEffect, useState } from 'react';
import { getUserRecords, updatePurchaseStatus } from './authService';  // Add a function to fetch user records from Firestore

function Sidebar({ uniqueTexts, filter, setFilter, togglePurchased, username }) {
  const [userRecords, setUserRecords] = useState([]); // Store user records from Firestore
  // const username = "exampleUser"; // Replace this with dynamic username

  useEffect(() => {
    // Fetch records from Firestore on load
    async function fetchRecords() {
      console.log("username:" + username);
      const records = await getUserRecords(username);
      console.log("records:", records); 
      setUserRecords(records); // Store Firestore records in state
    }

    fetchRecords();
  }, [username]);

  // Combine userRecords from Firestore with uniqueTexts and ensure uniqueness
  const allRecords = [...userRecords, ...uniqueTexts];

  // Ensure uniqueness by using a Set to filter unique text values
  const uniqueRecords = allRecords.filter(
    (item, index, self) => self.findIndex(i => i.text === item.text) === index
  );

  // Filter records by purchased status
  const filteredRecords = uniqueRecords.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'purchased') return item.purchased;
    if (filter === 'not purchased') return !item.purchased;
    return true;
  });

  // Sort records by purchased status, first letter, and then numbers
  const sortedRecords = filteredRecords.sort((a, b) => {
    // First, sort by purchased status (false (not purchased) comes first)
    if (a.purchased !== b.purchased) {
      return a.purchased ? 1 : -1; // Unpurchased first, then purchased
    }

    // Then, sort by the first letter
    const letterA = a.text[0].toUpperCase();
    const letterB = b.text[0].toUpperCase();
    if (letterA < letterB) return -1;
    if (letterA > letterB) return 1;

    // Finally, sort by the number part (after the first letter)
    const numberA = parseInt(a.text.slice(1), 10);
    const numberB = parseInt(b.text.slice(1), 10);

    return numberA - numberB;
  });

  // Handle checkbox toggle
  const handleCheckboxToggle = async (text) => {
    // Find the record
    const updatedRecords = uniqueRecords.map((item) => {
      if (item.text === text) {
        const updatedItem = { ...item, purchased: !item.purchased };
        
        // Update Firestore when checkbox is toggled
        updatePurchaseStatus(username, item.text, updatedItem.purchased);

        return updatedItem;
      }
      return item;
    });

    // Update the local state after toggling the checkbox
    setUserRecords(updatedRecords);
  };

  return (
    <div className="bg-gray-50 p-6 shadow-md h-full">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">History</h3>

      {/* Dropdown for filtering */}
      <select 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="ALL">All</option>
        <option value="purchased">Purchased</option>
        <option value="not purchased">Unpurchased</option>
      </select>

      {/* Display list of filtered and sorted records */}
      <ul className="space-y-2">
        {sortedRecords.map((record, index) => (
          <li key={index} className="flex items-center">
            <input
              type="checkbox"
              checked={record.purchased}
              onChange={() => handleCheckboxToggle(record.text)}  // Update the purchase status when checkbox is toggled
              className="mr-2 focus:ring-indigo-500"
            />
            <span className="text-lg text-gray-800">{record.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;