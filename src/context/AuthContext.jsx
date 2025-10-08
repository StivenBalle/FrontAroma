import React, { createContext, useContext, useState, useEffect } from "react";
import {
  login,
  googleLogin,
  updatePhone,
  getProfile,
  logout as apiLogout,
} from "../api.js";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  // Verifica si las cookies están aceptadas
  const hasCookieConsent = () => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name] = value;
      return acc;
    }, {});
    return cookies["cookie_consent"] === "true";
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!hasCookieConsent()) {
          console.log("Cookies no aceptadas; no se intenta cargar perfil.");
          setUser(null);
          setLoading(false);
          return;
        }
        const data = await getProfile();
        console.log("Perfil cargado:", data);
        setUser(data);
        if (!data.phone_number) {
          setShowPhoneModal(true);
        }
      } catch (err) {
        console.error("Error fetching profile:", err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginUser = async (email, password) => {
    try {
      // Verifica consentimiento de cookies antes del login
      if (!hasCookieConsent()) {
        Swal.fire({
          icon: "warning",
          title: "Cookies necesarias",
          text: "Debes aceptar las cookies para iniciar sesión. Por favor, haz clic en 'Aceptar Cookies' en el aviso.",
        });
        return {
          success: false,
          error: "Por favor acepte las cookies para poder iniciar sesión.",
        };
      }
      const data = await login(email, password);
      if (data.message === "✅ Login exitoso") {
        setUser(data.user);
        setAuthModalOpen(false);
        Swal.fire({
          icon: "success",
          title: "✅ Inicio de sesión exitoso",
          text: `Bienvenido, ${data.user.name}!`,
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
        if (!data.user.phone_number) {
          setShowPhoneModal(true);
        }
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error("❌ Error en login:", err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
    } catch (err) {
      console.error("❌ Error al cerrar sesión:", err.message);
    }
  };

  // Nueva función para Google Login
  const googleLoginUser = async (credential) => {
    if (!hasCookieConsent()) {
      Swal.fire(
        "Error",
        "Debes aceptar las cookies para iniciar sesión con Google",
        "error"
      );
      return { success: false, error: "Cookies no aceptadas" };
    }
    try {
      const data = await googleLogin(credential);
      if (data.message === "✅ Google login exitoso") {
        setUser(data.user);
        setAuthModalOpen(false);
        Swal.fire(
          "✅ Inicio de sesión con Google exitoso",
          `Bienvenido, ${data.user.name}!`,
          "success"
        ).then(() => {
          window.location.reload();
        });
        if (!data.user.phone_number) {
          setShowPhoneModal(true);
        }
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error("❌ Error en Google login:", err.message);
      return { success: false, error: err.message };
    }
  };

  // Nueva función para actualizar teléfono
  const updatePhoneNumber = async (phone_number) => {
    try {
      const data = await updatePhone(phone_number);
      setUser(data.user);
      setShowPhoneModal(false);
      Swal.fire(
        "✅ Teléfono actualizado",
        "Tu teléfono ha sido guardado",
        "success"
      );
    } catch (err) {
      console.error("❌ Error updating phone:", err.message);
      Swal.fire("Error", "No se pudo actualizar el teléfono", "error");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginUser,
        logout,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        showPhoneModal,
        setShowPhoneModal,
        googleLogin: googleLoginUser,
        updatePhoneNumber,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
