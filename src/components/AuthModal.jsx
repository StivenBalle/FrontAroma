import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SingupForm";

const AuthModal = () => {
  const { authModalOpen, closeAuthModal } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  console.log("🔵 AuthModal renderizado, authModalOpen:", authModalOpen); // 🔹 Debug

  if (!authModalOpen) return null;

  return (
    <div id="overlay" className="overlay">
      <div className="form-container">
        {showLogin ? (
          <LoginForm switchToSignup={() => setShowLogin(false)} />
        ) : (
          <SignupForm switchToLogin={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
