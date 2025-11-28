import React, { createContext, useContext, useState, useEffect } from "react";
import {
  login,
  googleLogin,
  updatePhone,
  getUserProfile,
  logout as apiLogout,
  setLogoutHandler,
  setUserHandler,
} from "../utils/api.js";
import logger from "../utils/logger";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

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
    setLogoutHandler(logout);
    setUserHandler(setUser);
    const checkAuth = async () => {
      try {
        if (!hasCookieConsent()) {
          logger.log("Cookies no aceptadas; no se intenta cargar perfil.");
          setUser(null);
          setLoading(false);
          return;
        }
        const data = await getUserProfile();
        logger.log("Perfil cargado:", data);
        setUser(data);
      } catch (err) {
        logger.error("Error fetching profile:", err.message);
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
      if (data?.message === "Login exitoso") {
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
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      logger.log("ERROR LOGIN =>", err);
      const status = err.status;
      const errorData = err.data;
      logger.log("STATUS =>", status);
      logger.log("ERROR DATA =>", errorData);

      if (errorData?.code === "ACCOUNT_LOCKED") {
        const mins = Math.max(1, errorData.remainingMin || 15);
        Swal.fire({
          icon: "error",
          title: "Cuenta bloqueada",
          html: `
          <p>Demasiados intentos fallidos</p>
          <h3 style="color:#dc2626; margin:15px 0; font-weight:bold;">
            Espera ${mins} minuto${mins > 1 ? "s" : ""}
          </h3>
          <small>Tu cuenta se desbloqueará automáticamente</small>
        `,
          allowOutsideClick: false,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#dc2626",
        });
        return { success: false };
      }

      if (errorData?.code === "INVALID_PASSWORD") {
        const remaining = errorData.remaining || 1;
        Swal.fire({
          icon: "warning",
          title: "Contraseña incorrecta",
          html: `
          <div style="text-align:center;">
            <p style="font-size:1.2em; margin:10px 0;">
              Te quedan <strong style="color:#f59e0b;">${remaining} intento${
            remaining > 1 ? "s" : ""
          }</strong>
            </p>
            <small style="color:#dc2626;">
              Tras 5 intentos fallidos, tu cuenta se bloqueará por 15 minutos
            </small>
          </div>
        `,
          confirmButtonText: "OK",
          confirmButtonColor: "#f59e0b",
        });
        return { success: false };
      }

      const msg = errorData?.error || err.message || "Error desconocido";
      Swal.fire({
        icon: "error",
        title: "Error de inicio de sesión",
        text: msg,
      });
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      logger.warn("Error cerrando sesión:", err.message);
    } finally {
      setUser(null);
    }
  };

  // Nueva función para Google Login
  const googleLoginUser = async (credential, nonce) => {
    if (!hasCookieConsent()) {
      Swal.fire(
        "Error",
        "Debes aceptar las cookies para iniciar sesión con Google",
        "error"
      );
      return { success: false, error: "Cookies no aceptadas" };
    }
    try {
      const data = await googleLogin(credential, nonce);
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
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      logger.error("❌ Error en Google login:", err.message);
      return { success: false, error: err.message };
    }
  };

  // Nueva función para actualizar teléfono
  const updatePhoneNumber = async (phone_number) => {
    try {
      const data = await updatePhone(phone_number);
      setUser(data.user);
      Swal.fire(
        "✅ Teléfono actualizado",
        "Tu teléfono ha sido guardado",
        "success"
      );
    } catch (err) {
      logger.error("❌ Error updating phone:", err.message);
      Swal.fire("Error", "No se pudo actualizar el teléfono", "error");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login: loginUser,
        logout,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        googleLogin: googleLoginUser,
        updatePhoneNumber,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
