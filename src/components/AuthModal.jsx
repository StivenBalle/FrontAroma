import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SingupForm";
import Swal from "sweetalert2";

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
      Swal.fire({
        icon: "warning",
        title: "Cookies necesarias",
        text: "Debes aceptar las cookies para iniciar sesión o registrarte. Por favor, haz clic en 'Aceptar Cookies' en el aviso.",
      });
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
