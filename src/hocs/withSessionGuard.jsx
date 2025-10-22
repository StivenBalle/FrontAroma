import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { getProfile } from "../api";

const withSessionGuard = (WrappedComponent) => {
  return (props) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
      const verifySession = async () => {
        try {
          await getProfile();
          setCheckingSession(false);
        } catch (error) {
          console.warn("🔒 Sesión inválida o expirada:", error.message);

          await Swal.fire({
            icon: "warning",
            title: "Sesión expirada",
            text: "Tu sesión ha terminado. Inicia sesión nuevamente para continuar.",
            confirmButtonText: "Aceptar",
          });

          if (setUser) setUser(null);
          navigate("/");
        }
      };

      verifySession();
    }, [navigate, setUser]);

    if (checkingSession) {
      return (
        <div className="loading-products">
          <div className="loading-content">
            <div className="spinner"></div>
            <h3>Verificando sesión...</h3>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withSessionGuard;
