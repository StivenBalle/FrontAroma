import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  MapPin,
  Mail,
  Phone,
  Calendar,
  User,
  CreditCard,
  Home,
  Download,
  Share2,
  Truck,
} from "lucide-react";
import bolsaCafe from "../assets/LogoCafe.png";
import LoadingScreen from "../components/LoadingScreen";
import { getPurchaseDetails } from "../utils/api.js";
import logger from "../utils/logger.js";
import "../App.css";

const Success = () => {
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchPurchase = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (!sessionId) {
        Swal.fire("Error", "No se encontró el ID de la sesión", "error");
        navigate("/");
        return;
      }

      try {
        const data = await getPurchaseDetails(sessionId);
        setPurchase(data);
        setShowConfetti(true);

        setTimeout(() => setShowConfetti(false), 5000);
      } catch (err) {
        logger.error("❌ Error cargando detalles:", err.message);
        if (err.response?.status === 403) {
          Swal.fire(
            "Acceso denegado",
            "Esta compra no pertenece a tu cuenta",
            "error"
          );
          navigate("/");
          return;
        }

        Swal.fire(
          "Error",
          "No se pudo obtener la información de la compra",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [navigate]);

  const handleDownloadReceipt = () => {
    Swal.fire({
      title: "Descargando recibo...",
      text: "Tu recibo se descargará en breve",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
    // Aquí iría la lógica para descargar el PDF del recibo
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mi compra en Aromas de Serranía",
          text: `¡Acabo de comprar ${purchase?.producto}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      Swal.fire({
        title: "Compartir",
        text: "Función de compartir no disponible en este navegador",
        icon: "info",
      });
    }
  };

  if (loading) {
    return (
      <LoadingScreen
        title="Cargando compra..."
        subtitle="Estamos preparando los detalles de tu compra"
      />
    );
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      complete: { text: "Completado", color: "#10b981", bgColor: "#d1fae5" },
      paid: { text: "Pagado", color: "#10b981", bgColor: "#d1fae5" },
      processing: { text: "Procesando", color: "#f59e0b", bgColor: "#fef3c7" },
      pending: { text: "Pendiente", color: "#6b7280", bgColor: "#f3f4f6" },
    };
    return statusMap[status?.toLowerCase()] || statusMap["pending"];
  };

  const statusInfo = getStatusInfo(purchase?.status);

  return (
    <div className="success-page">
      {showConfetti && <div className="confetti-container"></div>}

      <div className="success-container">
        <div className="success-header">
          <div className="success-icon-wrapper">
            <CheckCircle className="success-icon-pay" />
          </div>
          <h1 className="success-title-pay">¡Pago Exitoso!</h1>
          <p className="success-subtitle">
            Gracias por tu compra. Tu pedido ha sido procesado correctamente.
          </p>
        </div>

        {purchase ? (
          <>
            <div className="success-card product-card">
              <div className="card-header">
                <Package className="card-icon-success" />
                <h2 className="card-title">Detalles del Producto</h2>
              </div>

              <div className="product-info">
                <div className="product-image-wrapper">
                  <img
                    src={purchase.image || bolsaCafe}
                    alt={purchase.producto}
                    className="product-image-success"
                  />
                </div>

                <div className="product-details">
                  <h3 className="product-name-success">{purchase.producto}</h3>
                  <div className="product-price-success">
                    <span className="price-label">Precio:</span>
                    <span className="price-amount">${purchase.precio}</span>
                  </div>
                  <div className="product-status">
                    <span className="price-label">Estado del pedido:</span>
                    <span
                      className="status-badge-success"
                      style={{
                        color: statusInfo.color,
                        backgroundColor: statusInfo.bgColor,
                      }}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-grid">
              <div className="success-card info-card">
                <div className="card-header">
                  <User className="card-icon" />
                  <h2 className="card-title">Información del Comprador</h2>
                </div>

                <div className="info-list">
                  <div className="info-item">
                    <User className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Nombre</span>
                      <span className="info-value">{purchase.usuario}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <Mail className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">{purchase.email}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <Phone className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Teléfono</span>
                      <span className="info-value">
                        {purchase.phone || "No disponible"}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <Calendar className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Fecha de compra</span>
                      <span className="info-value">
                        {new Date(purchase.fecha).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="success-card info-card">
                <div className="card-header">
                  <Truck className="card-icon" />
                  <h2 className="card-title">Información de Envío</h2>
                </div>

                <div className="info-list">
                  <div className="info-item">
                    <MapPin className="info-icon-success" />
                    <div className="info-content">
                      <span className="info-label">Dirección</span>
                      <span className="info-value">
                        {purchase.shipping_address?.line1 || "No disponible"}
                      </span>
                    </div>
                  </div>

                  {purchase.shipping_address?.city && (
                    <div className="info-item">
                      <MapPin className="info-icon-success" />
                      <div className="info-content">
                        <span className="info-label">Ciudad</span>
                        <span className="info-value">
                          {purchase.shipping_address.city}
                        </span>
                      </div>
                    </div>
                  )}

                  {purchase.shipping_address?.postal_code && (
                    <div className="info-item">
                      <MapPin className="info-icon-success" />
                      <div className="info-content">
                        <span className="info-label">Código Postal</span>
                        <span className="info-value">
                          {purchase.shipping_address.postal_code}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="info-item">
                    <CreditCard className="info-icon-success" />
                    <div className="info-content">
                      <span className="info-label">Método de pago</span>
                      <span className="info-value">
                        {purchase.payment_method || "Tarjeta de crédito"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="success-card contact-card">
              <div className="contact-content">
                <div className="contact-icon-wrapper">
                  <Mail className="contact-icon" />
                </div>
                <div className="contact-text">
                  <h3 className="contact-title">¿Necesitas ayuda?</h3>
                  <p className="contact-description">
                    Contáctanos en{" "}
                    <a
                      href="mailto:cafearomadelaserrania2013@gmail.com"
                      className="contact-link"
                    >
                      cafearomadelaserrania2013@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="action-btn primary-btn"
                onClick={() => navigate("/")}
              >
                <Home size={20} />
                <span>Volver al Inicio</span>
              </button>

              <button
                className="action-btn secondary-btn"
                onClick={handleDownloadReceipt}
              >
                <Download size={20} />
                <span>Descargar Recibo</span>
              </button>
            </div>
          </>
        ) : (
          <div className="success-card error-card">
            <p className="error-message">
              No se encontraron los detalles de tu compra.
            </p>
            <button
              className="action-btn primary-btn"
              onClick={() => navigate("/")}
            >
              <Home size={20} />
              <span>Volver al Inicio</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;
