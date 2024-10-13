import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./firebase";  // Firebase setup file

// Register User
export const registerUser = async (username, password) => {
  const userRef = doc(db, "users", username);

  // Check if the user already exists
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    throw new Error("User already exists!");
  } else {
    // If user doesn't exist, create new user
    await setDoc(userRef, {
      username,
      password: hashPassword(password), // For security, hash the password
    });
  }
};

// Sign In User
export const signInUser = async (username, password) => {
  const userRef = doc(db, "users", username);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    throw new Error("User not found!");
  }

  const userData = docSnap.data();
  if (userData.password !== hashPassword(password)) {
    throw new Error("Incorrect password!");
  }

  // If sign-in is successful, return user data
  return userData;
};

// Hash password (you should use a better hashing method for production)
const hashPassword = (password) => {
  return btoa(password); // Simple base64 encoding for example purposes
};

// Add new records for the current user
export const addRecord = async (username, record) => {
    const userRef = doc(db, "users", username);
  
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Update existing records array
      await updateDoc(userRef, {
        records: arrayUnion(record)
      });
    } else {
      // Create a new document if user doesn't exist
      await setDoc(userRef, {
        records: [record]
      });
    }
  };
  
  // Fetch user records from Firestore
  export const getUserRecords = async (username) => {
    const userRef = doc(db, "users", username);
    const userDoc = await getDoc(userRef);
  
    if (userDoc.exists()) {
      return userDoc.data().records || [];
    } else {
      return [];
    }
  };
  
  // Update purchase status of a record in Firestore
  export const updatePurchaseStatus = async (username, recordText, purchased) => {
    const userRef = doc(db, "users", username);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedRecords = userData.records.map((item) => {
        if (item.text === recordText) {
          return { ...item, purchased };
        }
        return item;
      });
  
      // Update the user document with updated records array
      await updateDoc(userRef, {
        records: updatedRecords
      });
    }
  };