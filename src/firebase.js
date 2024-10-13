import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import getFirestore from firebase/firestore

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9thPTYS0WPQxJsnS8CR4xbhIVdfq0Rsw",
  authDomain: "color-extractor-793b9.firebaseapp.com",
  projectId: "color-extractor-793b9",
  storageBucket: "color-extractor-793b9.appspot.com",
  messagingSenderId: "475746835731",
  appId: "1:475746835731:web:ee49c276a2cd9a46e74ee6",
  measurementId: "G-Z637MEKVZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

export { db };