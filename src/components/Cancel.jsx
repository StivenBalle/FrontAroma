import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  XCircle,
  Home,
  CreditCard,
  HelpCircle,
  RefreshCw,
  Phone,
  Mail,
  ShoppingCart,
  Lightbulb,
} from "lucide-react";
import "../App.css";

const Cancel = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:cafearomadelaserrania@gmail.com";
  };

  const reasons = [
    {
      icon: <CreditCard size={24} />,
      title: "Tarjeta rechazada",
      description: "Tu banco puede haber rechazado la transacción",
    },
    {
      icon: <AlertTriangle size={24} />,
      title: "Fondos insuficientes",
      description: "Verifica que tu tarjeta tenga saldo disponible",
    },
    {
      icon: <XCircle size={24} />,
      title: "Información incorrecta",
      description: "Los datos de pago pueden estar incorrectos",
    },
    {
      icon: <RefreshCw size={24} />,
      title: "Sesión expirada",
      description: "El tiempo de pago puede haber expirado",
    },
  ];

  return (
    <div className="cancel-page">
      <div className={`cancel-container ${showContent ? "show" : ""}`}>
        <div className="cancel-header">
          <div className="error-icon-wrapper">
            <div className="error-icon-background">
              <XCircle className="error-icon" />
            </div>
          </div>

          <h1 className="cancel-title">Pago Cancelado</h1>
          <p className="cancel-subtitle">
            No se pudo procesar tu pago. No te preocupes, no se realizó ningún
            cargo.
          </p>
        </div>

        <div className="cancel-card main-message-card">
          <div className="card-header">
            <AlertTriangle className="card-icon-cancel warning-icon" />
            <h2 className="card-title">¿Qué sucedió?</h2>
          </div>

          <p className="main-message">
            Tu pago no pudo ser procesado. Esto puede deberse a que cancelaste
            la transacción o tu banco rechazó el pago. No te preocupes, puedes
            intentarlo nuevamente.
          </p>
        </div>

        <div className="cancel-card reasons-card">
          <div className="card-header">
            <HelpCircle className="card-icon" />
            <h2 className="card-title">Posibles Razones</h2>
          </div>

          <div className="reasons-grid">
            {reasons.map((reason, index) => (
              <div key={index} className="reason-item">
                <div className="reason-icon">{reason.icon}</div>
                <div className="reason-content">
                  <h3 className="reason-title">{reason.title}</h3>
                  <p className="reason-description">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cancel-card recommendations-card">
          <div className="card-header">
            <CreditCard className="card-icon" />
            <h2 className="card-title">Te Recomendamos</h2>
          </div>

          <div className="recommendations-list">
            <div className="recommendation-item">
              <div className="recommendation-number">1</div>
              <div className="recommendation-content">
                <h3 className="recommendation-title">Verifica tus datos</h3>
                <p className="recommendation-text">
                  Asegúrate de ingresar correctamente el número de tarjeta,
                  fecha de vencimiento y código de seguridad.
                </p>
              </div>
            </div>

            <div className="recommendation-item">
              <div className="recommendation-number">2</div>
              <div className="recommendation-content">
                <h3 className="recommendation-title">Consulta con tu banco</h3>
                <p className="recommendation-text">
                  Contacta a tu banco para verificar que tu tarjeta esté
                  habilitada para compras en línea.
                </p>
              </div>
            </div>

            <div className="recommendation-item">
              <div className="recommendation-number">3</div>
              <div className="recommendation-content">
                <h3 className="recommendation-title">
                  Intenta otro método de pago
                </h3>
                <p className="recommendation-text">
                  Si el problema persiste, prueba con otra tarjeta o método de
                  pago diferente.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cancel-card motivation-card">
          <div className="motivation-content">
            <ShoppingCart className="motivation-icon" />
            <h3 className="motivation-title">
              No pierdas la oportunidad de disfrutar nuestro café
            </h3>
            <p className="motivation-text">
              Café 100% colombiano, cultivado en las montañas de Aguachica. Un
              sabor único que no puedes dejar pasar.
            </p>
          </div>
        </div>

        <div className="cancel-card support-card">
          <div className="card-header">
            <Mail className="card-icon" />
            <h2 className="card-title">¿Necesitas Ayuda?</h2>
          </div>

          <p className="support-description">
            Si continúas teniendo problemas, nuestro equipo está listo para
            ayudarte.
          </p>

          <div className="support-methods">
            <a
              href="mailto:cafearomadelaserrania2013@gmail.com"
              className="support-method"
            >
              <Mail size={20} />
              <span>cafearomadelaserrania2013@gmail.com</span>
            </a>
            <a href="tel:+573185818424" className="support-method">
              <Phone size={20} />
              <span>+57 318 581 8424</span>
            </a>
          </div>
        </div>

        <div className="cancel-actions">
          <button className="cancel-btn primary-btn" onClick={handleGoHome}>
            <Home size={20} />
            <span>Volver al inicio</span>
          </button>

          <button
            className="cancel-btn tertiary-btn"
            onClick={handleContactSupport}
          >
            <Mail size={20} />
            <span>Contactar Soporte</span>
          </button>
        </div>

        <div className="cancel-footer">
          <p className="footer-text-cancel">
            <Lightbulb strokeWidth="2.5px" color="orange" />{" "}
            <strong>Recuerda:</strong> No se realizó ningún cargo a tu cuenta.
            Puedes intentar de nuevo cuando estés listo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
