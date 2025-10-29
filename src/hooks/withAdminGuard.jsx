import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMinimumLoadingTime } from "../hooks/useMinimumLoading.jsx";
import "../styles/AdminStats.css";
import Swal from "sweetalert2";

const withAdminGuard = (WrappedComponent) => {
  return (props) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [verifyingAccess, setVerifyingAccess] = useState(false);
    const showLoading = useMinimumLoadingTime(verifyingAccess, 1000);

    useEffect(() => {
      if (loading) return;

      if (!user || user.role !== "admin") {
        setVerifyingAccess(true);
        const timeoutId = setTimeout(() => {
          setVerifyingAccess(false);
          Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: "Solo administradores pueden ver esta página.",
          }).then(() => {
            navigate("/");
          });
        }, 800);

        return () => clearTimeout(timeoutId);
      }
    }, [user, loading, navigate]);

    if (loading || showLoading) {
      return (
        <div className="stats-loading-container">
          <div className="loading-content">
            <div className="spinner-stats"></div>
            <h3 className={verifyingAccess ? "loading-denied" : ""}>
              {verifyingAccess
                ? "Verificando acceso..."
                : "Cargando información..."}
            </h3>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminGuard;
