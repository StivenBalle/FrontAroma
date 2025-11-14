import React, { useEffect, useState } from "react";
import { getUserProfileById, getHistorialByUserId } from "../utils/api.js";
import "../styles/AdminStats.css";
import logger from "../utils/logger.js";
import {
  Calendar1,
  Chromium,
  CircleDollarSign,
  Frown,
  Handbag,
  Laugh,
  Mail,
  MapPin,
  ShieldUser,
  TrendingUp,
  User,
  X,
} from "lucide-react";

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
        logger.error("Error al cargar detalles del usuario:", error);
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
            <X strokeWidth="2.5px" />
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
                    <ShieldUser strokeWidth="2.5px" />
                  ) : (
                    <User strokeWidth="2.5px" />
                  )}
                  {userDetails.role === "admin" ? "Administrador" : "Cliente"}
                </span>

                {!isFrequentBuyer ? (
                  <span className="nofrequent-buyer-badge">
                    <Frown strokeWidth="2.5px" />
                    Cliente poco frecuente
                  </span>
                ) : (
                  <span className="frequent-buyer-badge">
                    <Laugh strokeWidth="2.5px" />
                    Cliente Frecuente
                  </span>
                )}

                <span
                  className={`auth-badge auth-${userDetails.auth_provider}`}
                >
                  {userDetails.auth_provider === "google" ? (
                    <Chromium strokeWidth="2.5px" />
                  ) : (
                    <Mail strokeWidth="2.5px" />
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
                <Handbag strokeWidth="2.5px" />
              </div>
              <div className="stat-info">
                <span className="stat-number">{totalPurchases}</span>
                <span className="stat-text">Compras totales</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-box revenue-stat">
                <CircleDollarSign strokeWidth="2.5px" />
              </div>
              <div className="stat-info">
                <span className="stat-number">${totalSpent.toFixed(2)}</span>
                <span className="stat-text">Total gastado</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-box average-stat">
                <TrendingUp strokeWidth="2.5px" />
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
                <User strokeWidth="2.5px" />
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
                <MapPin strokeWidth="2.5px" />
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
                <Calendar1 strokeWidth="2.5px" />
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
            <X strokeWidth="2.5px" />
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
