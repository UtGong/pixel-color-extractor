const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');  // For handling file uploads

const app = express();
app.use(cors());  // Enable CORS for frontend-backend communication

// Set up multer to handle file uploads, storing them in 'uploads/' directory
const upload = multer({ dest: 'uploads/' });

// Function to extract unique texts from the API response
function getUniqueText(response) {
  const texts = response.map(item => item.text);  // Extract the "text" values
  return [...new Set(texts)];  // Use Set to filter out duplicate texts
}

// Function to filter and sort texts based on the "one capital letter + 1 or 2 numbers" pattern
function filterAndSortTexts(texts) {
  const regex = /^[A-Z]\d{1,2}$/;  // Regular expression to match the pattern

  return texts
    .filter(text => regex.test(text))  // Filter texts based on the pattern
    .sort((a, b) => {
      const letterA = a[0];
      const letterB = b[0];
      const numberA = parseInt(a.slice(1), 10);  // Extract the number part
      const numberB = parseInt(b.slice(1), 10);

      // Sort by the capital letter first, and then by the number
      if (letterA < letterB) return -1;
      if (letterA > letterB) return 1;
      return numberA - numberB;
    });
}

// API route to handle image uploads
app.post('/upload-image', upload.single('image'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Prepare form data for the API request
  const form = new FormData();
  form.append('image', fs.createReadStream(file.path));

  // External API URL for image-to-text conversion
  const apiUrl = 'https://api.api-ninjas.com/v1/imagetotext';

  axios.post(apiUrl, form, {
    headers: {
      ...form.getHeaders(),
      'X-Api-Key': 'XmLd4F+8scA/XbC9UcGJOQ==n3ozI3oIWfU8HEoa',  // Replace with your actual API key
    },
  })
  .then((response) => {
    // Call the getUniqueText function to extract unique texts
    const uniqueTexts = getUniqueText(response.data);
    console.log(uniqueTexts);

    // Filter and sort the unique texts based on the specified pattern
    const filteredAndSortedTexts = filterAndSortTexts(uniqueTexts);

    // Send filtered and sorted texts back to the frontend
    res.json(filteredAndSortedTexts);
  })
  .catch((error) => {
    console.error('Error making API request:', error.message);
    res.status(500).json({ message: 'Failed to process image' });
  })
  .finally(() => {
    // Clean up uploaded file after processing
    fs.unlinkSync(file.path);
  });
});

// Start the backend server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});