import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import { useMinimumLoadingTime } from "../hooks/useMinimumLoading.jsx";
import { useModernAlert } from "../hooks/useModernAlert.jsx";
import logger from "../utils/logger";
import { getProfile } from "../utils/api.js";

const withSessionGuard = (WrappedComponent) => {
  return (props) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [checkingSession, setCheckingSession] = useState(true);
    const showLoading = useMinimumLoadingTime(checkingSession, 1000);
    const { alert, warning } = useModernAlert();

    useEffect(() => {
      const verifySession = async () => {
        try {
          await getProfile();
          setCheckingSession(false);
        } catch (error) {
          logger.warn("🔒 Sesión inválida o expirada:", error.message);

          await warning(
            "Sesión expirada",
            "Tu sesión ha terminado. Inicia sesión nuevamente para continuar."
          );

          if (setUser) setUser(null);
          navigate("/");
        }
      };

      verifySession();
    }, [navigate, setUser]);

    if (showLoading) {
      return (
        <>
          {alert}
          <LoadingScreen title="Verificando sesión..." />
        </>
      );
    }

    return (
      <>
        {alert}
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withSessionGuard;
