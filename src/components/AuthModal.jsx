import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SingupForm";

const AuthModal = () => {
  const { authModalOpen, closeAuthModal } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  console.log("🔵 AuthModal renderizado, authModalOpen:", authModalOpen);

  const hasCookieConsent = () => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name] = value;
      return acc;
    }, {});
    return cookies["cookie_consent"] === "true";
  };

  useEffect(() => {
    if (!hasCookieConsent()) {
      console.log("Cookies no aceptadas; no se intenta cargar perfil.");
    }
  }, [authModalOpen]);

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
