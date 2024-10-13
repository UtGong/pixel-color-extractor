import React, { useState } from "react";
import { registerUser, signInUser } from "./authService";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function AuthPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle Sign Up
  const handleSignUp = async () => {
    if (username && password) {
      try {
        await registerUser(username, password);
        alert("User registered successfully");
        setUsername("");
        setPassword("");
        onLoginSuccess(username); // Pass the correct username to the parent component
        navigate("/home"); // Redirect to the main page after successful sign-up
      } catch (err) {
        setError("Error during registration: " + err.message);
      }
    }
  };

  // Handle Sign In
  const handleSignIn = async () => {
    if (username && password) {
      try {
        await signInUser(username, password);
        alert("User signed in successfully");
        onLoginSuccess(username); // Pass the correct username to the parent component
        navigate("/home"); // Redirect to the main page after successful sign-in
      } catch (err) {
        setError("Error during sign-in: " + err.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {isSigningIn ? "Sign In" : "Sign Up"}
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Username Input */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Sign In / Sign Up Button */}
        {isSigningIn ? (
          <button
            onClick={handleSignIn}
            disabled={!username || !password}
            className={`w-full p-3 rounded-lg text-white font-semibold ${
              !username || !password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } transition-colors`}
          >
            Sign In
          </button>
        ) : (
          <button
            onClick={handleSignUp}
            disabled={!username || !password}
            className={`w-full p-3 rounded-lg text-white font-semibold ${
              !username || !password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } transition-colors`}
          >
            Sign Up
          </button>
        )}

        {/* Toggle between Sign In and Sign Up */}
        <div className="text-center mt-4">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setIsSigningIn(!isSigningIn)}
          >
            {isSigningIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;