import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../utils/api";
import { useMinimumLoadingTime } from "../hooks/useMinimumLoading.jsx";
import { useModernAlert } from "../hooks/useModernAlert.jsx";
import logger from "../utils/logger.js";

const withAdminGuard = (WrappedComponent) => {
  return (props) => {
    const { user, loading, logout } = useAuth();
    const [checkingServerRole, setCheckingServerRole] = useState(true);
    const { alert, error } = useModernAlert();
    const navigate = useNavigate();

    const showLoading = useMinimumLoadingTime(checkingServerRole, 1000);

    useEffect(() => {
      const verifyAccess = async () => {
        if (loading) return;

        try {
          const freshUser = await getUserProfile();

          if (!freshUser || !["admin", "viewer"].includes(freshUser.role)) {
            await error(
              "Acceso restringido",
              "Debes tener rol admin para acceder."
            );

            navigate("/");
            return;
          }
        } catch (err) {
          logger.info("Sesión inválida, la sesión expiró o no tiene acceso.");
          logout();
          navigate("/");
        } finally {
          setCheckingServerRole(false);
        }
      };

      verifyAccess();
    }, [loading, navigate, logout]);

    if (loading || checkingServerRole || showLoading) {
      return (
        <>
          {alert}
          <div className="stats-loading-container">
            <div className="loading-content">
              <div className="spinner-stats"></div>
              <h3 className={checkingServerRole ? "loading-denied" : ""}>
                {checkingServerRole
                  ? "Verificando acceso..."
                  : "Cargando información..."}
              </h3>
            </div>
          </div>
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

export default withAdminGuard;
