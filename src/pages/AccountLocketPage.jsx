import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Lock,
  Clock,
  Mail,
  Phone,
  ShieldAlert,
  AlertTriangle,
  Home,
  RefreshCw,
  Info,
  HelpCircle,
} from "lucide-react";
import "../styles/AdminSecurity.css";

const AccountLocked = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [unlockTime, setUnlockTime] = useState(null);

  useEffect(() => {
    const lockInfo = location.state;

    if (lockInfo?.remainingMs) {
      setTimeRemaining(lockInfo.remainingMs);

      if (lockInfo.unlockTime) {
        setUnlockTime(lockInfo.unlockTime);
      }
    }
  }, [location]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setTimeout(() => {
            navigate("/", {
              state: {
                message:
                  "Tu cuenta ha sido desbloqueada. Puedes intentar iniciar sesión nuevamente.",
              },
            });
          }, 2000);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, navigate]);

  // Formatear tiempo restante
  const formatTime = (ms) => {
    if (!ms || ms <= 0) return "Cuenta desbloqueada";

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Información de contacto
  const contactInfo = {
    email: "cafearomadelaserrania2013@gmail.com",
    phone: "+57 318 581 8424",
    whatsapp: "+57 318 581 8424",
    hours: "Lunes a Sábado: 8:00 AM - 6:00 PM",
  };

  return (
    <div className="account-locked-page">
      <div className="locked-container">
        {/* Animated Lock Icon */}
        <div className="locked-icon-wrapper">
          <div className="lock-circle">
            <Lock className="lock-icon" />
          </div>
          <div className="lock-pulse"></div>
        </div>

        {/* Main Content */}
        <div className="locked-content">
          <h1 className="locked-title">Cuenta Bloqueada Temporalmente</h1>

          <p className="locked-subtitle">
            Tu cuenta ha sido bloqueada por razones de seguridad debido a
            múltiples intentos fallidos de inicio de sesión.
          </p>

          {/* Countdown Timer */}
          {timeRemaining !== null && timeRemaining > 0 && (
            <div className="countdown-card">
              <div className="countdown-header">
                <Clock className="countdown-icon" />
                <span className="countdown-label">Tiempo Restante</span>
              </div>
              <div className="countdown-time">{formatTime(timeRemaining)}</div>
              {unlockTime && (
                <p className="countdown-unlock">
                  Podrás intentar nuevamente a las <strong>{unlockTime}</strong>
                </p>
              )}
            </div>
          )}

          {/* Security Info */}
          <div className="info-card">
            <div className="info-header">
              <ShieldAlert className="info-icon" />
              <h2 className="info-title">¿Por qué se bloqueó mi cuenta?</h2>
            </div>
            <div className="info-content">
              <div className="info-item">
                <AlertTriangle size={20} className="item-icon" />
                <p>
                  Se detectaron múltiples intentos fallidos de inicio de sesión
                </p>
              </div>
              <div className="info-item">
                <ShieldAlert size={20} className="item-icon" />
                <p>Esta es una medida de seguridad para proteger tu cuenta</p>
              </div>
              <div className="info-item">
                <Clock size={20} className="item-icon" />
                <p>El bloqueo es temporal y se levantará automáticamente</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="contact-card">
            <div className="contact-header">
              <HelpCircle className="contact-icon" />
              <h2 className="contact-title">¿Necesitas Ayuda?</h2>
            </div>

            <p className="contact-description">
              Si crees que esto es un error o necesitas asistencia inmediata,
              contáctanos:
            </p>

            <div className="contact-methods">
              <a
                href={`mailto:${contactInfo.email}`}
                className="contact-method email"
              >
                <div className="method-icon-wrapper">
                  <Mail className="method-icon" />
                </div>
                <div className="method-info">
                  <span className="method-label">Email</span>
                  <span className="method-value">{contactInfo.email}</span>
                </div>
              </a>

              <a
                href={`tel:${contactInfo.phone}`}
                className="contact-method phone"
              >
                <div className="method-icon-wrapper">
                  <Phone className="method-icon" />
                </div>
                <div className="method-info">
                  <span className="method-label">Teléfono</span>
                  <span className="method-value">{contactInfo.phone}</span>
                </div>
              </a>

              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(
                  /[^0-9]/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-method whatsapp"
              >
                <div className="method-icon-wrapper">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="method-icon"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="method-info">
                  <span className="method-label">WhatsApp</span>
                  <span className="method-value">{contactInfo.whatsapp}</span>
                </div>
              </a>
            </div>

            <div className="contact-hours">
              <Clock size={18} />
              <span>{contactInfo.hours}</span>
            </div>
          </div>

          {/* Tips Section */}
          <div className="tips-card">
            <div className="tips-header">
              <Info className="tips-icon" />
              <h3 className="tips-title">Consejos de Seguridad</h3>
            </div>
            <ul className="tips-list">
              <li className="tip-item">
                <span className="tip-bullet">✓</span>
                Verifica que estés usando la contraseña correcta
              </li>
              <li className="tip-item">
                <span className="tip-bullet">✓</span>
                Asegúrate de que el Caps Lock esté desactivado
              </li>
              <li className="tip-item">
                <span className="tip-bullet">✓</span>
                Si olvidaste tu contraseña, usa la opción de recuperación
              </li>
              <li className="tip-item">
                <span className="tip-bullet">✓</span>
                Nunca compartas tu contraseña con nadie
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => navigate("/")}>
              <Home size={20} />
              <span>Volver al Inicio</span>
            </button>

            <button
              className="btn-secondary"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={20} />
              <span>Actualizar Estado</span>
            </button>
          </div>

          {/* Footer Note */}
          <p className="footer-note">
            Este bloqueo es automático y temporal. Tu cuenta se desbloqueará
            automáticamente después del tiempo indicado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountLocked;
