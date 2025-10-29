import React, { useEffect, useState } from "react";
import { getUserProfileById, getHistorialByUserId } from "../api";
import "../styles/AdminStats.css";

const UserDetailsModal = ({ userId, onClose }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const [userData, historyData] = await Promise.all([
          getUserProfileById(userId),
          getHistorialByUserId(userId),
        ]);

        setUserDetails(userData);
        setPurchaseHistory(historyData.compras || []);
      } catch (error) {
        console.error("Error al cargar detalles del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  // Calcular estadísticas
  const totalPurchases = purchaseHistory.length;
  const totalSpent = purchaseHistory.reduce(
    (sum, purchase) => sum + Number(purchase.precio || 0),
    0
  );
  const isFrequentBuyer = totalPurchases >= 5;

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (loading) {
    return (
      <div className="modal-overlay-details" onClick={onClose}>
        <div
          className="modal-details-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="loading-details">
            <div className="spinner-details"></div>
            <p>Cargando información del usuario...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return null;
  }

  return (
    <div className="modal-overlay-details" onClick={onClose}>
      <div
        className="modal-details-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-details-header">
          <div className="header-title-section">
            <h2>Detalles del Usuario</h2>
            <p>Información completa del perfil</p>
          </div>
          <button
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="modal-details-body">
          {/* Sección de Avatar y Datos Principales */}
          <div className="user-main-info">
            <div className="user-avatar-section">
              <div className="user-avatar-extra-large">
                {userDetails.image ? (
                  <img
                    src={userDetails.image}
                    alt={userDetails.name || "Usuario"}
                    className="avatar-img-user"
                  />
                ) : (
                  <span className="avatar-letter-large">
                    {userDetails.name ? userDetails.name[0].toUpperCase() : "U"}
                  </span>
                )}
              </div>

              <div className="user-badges">
                <span className={`role-badge-large role-${userDetails.role}`}>
                  {userDetails.role === "admin" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                  {userDetails.role === "admin" ? "Administrador" : "Cliente"}
                </span>

                {isFrequentBuyer && (
                  <span className="frequent-buyer-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    Cliente Frecuente
                  </span>
                )}

                <span
                  className={`auth-badge auth-${userDetails.auth_provider}`}
                >
                  {userDetails.auth_provider === "google" ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                  {userDetails.auth_provider === "google" ? "Google" : "Local"}
                </span>
              </div>
            </div>

            <div className="user-main-details">
              <h3 className="user-full-name">
                {userDetails.name || "Sin nombre"}
              </h3>
              <p className="user-email-large">{userDetails.email}</p>
              <p className="user-id-display">ID: #{userId}</p>
            </div>
          </div>

          {/* Estadísticas de Compras */}
          <div className="purchase-stats">
            <div className="stat-box">
              <div className="stat-icon-box purchases-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">{totalPurchases}</span>
                <span className="stat-text">Compras totales</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-box revenue-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">${totalSpent.toFixed(2)}</span>
                <span className="stat-text">Total gastado</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-box average-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">
                  $
                  {totalPurchases > 0
                    ? (totalSpent / totalPurchases).toFixed(2)
                    : "0.00"}
                </span>
                <span className="stat-text">Promedio por compra</span>
              </div>
            </div>
          </div>

          {/* Información Detallada */}
          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-card-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <h4>Información Personal</h4>
              </div>
              <div className="detail-card-body">
                <div className="detail-item">
                  <span className="detail-item-label">Nombre completo</span>
                  <span className="detail-item-value">
                    {userDetails.name || "No especificado"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-item-label">Correo electrónico</span>
                  <span className="detail-item-value">{userDetails.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-item-label">Teléfono</span>
                  <span className="detail-item-value">
                    {userDetails.phone_number || "No registrado"}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-card-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h4>Dirección de Envío</h4>
              </div>
              <div className="detail-card-body">
                {userDetails.address_full ? (
                  <>
                    <div className="detail-item">
                      <span className="detail-item-label">Calle y número</span>
                      <span className="detail-item-value">
                        {userDetails.address_full.line1 || "No especificado"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-item-label">Ciudad</span>
                      <span className="detail-item-value">
                        {userDetails.address_full.city || "No especificado"}
                      </span>
                    </div>
                    {userDetails.address_full.state && (
                      <div className="detail-item">
                        <span className="detail-item-label">
                          Departamento/Estado
                        </span>
                        <span className="detail-item-value">
                          {userDetails.address_full.state}
                        </span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-item-label">País</span>
                      <span className="detail-item-value">
                        {userDetails.address_full.country || "No especificado"}
                      </span>
                    </div>
                    {userDetails.address_full.postal_code && (
                      <div className="detail-item">
                        <span className="detail-item-label">Código Postal</span>
                        <span className="detail-item-value">
                          {userDetails.address_full.postal_code}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="detail-item">
                    <span className="detail-item-label">Dirección</span>
                    <span className="detail-item-value">No registrada</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-card-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h4>Cuenta</h4>
              </div>
              <div className="detail-card-body">
                <div className="detail-item">
                  <span className="detail-item-label">Fecha de registro</span>
                  <span className="detail-item-value">
                    {new Date(userDetails.created_at).toLocaleDateString(
                      "es-CO",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-item-label">
                    Tipo de autenticación
                  </span>
                  <span className="detail-item-value">
                    {userDetails.auth_provider === "google"
                      ? "Google OAuth"
                      : "Registro tradicional"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-item-label">Rol</span>
                  <span className="detail-item-value">
                    {userDetails.role === "admin" ? "Administrador" : "Cliente"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="modal-details-footer">
          <button className="close-details-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
