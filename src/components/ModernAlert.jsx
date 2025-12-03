import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  X,
} from "lucide-react";
import "../styles/AdminStats.css";

const ModernAlert = ({
  isOpen,
  onClose,
  onConfirm,
  type = "info",
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  showCancel = false,
  confirmColor,
  cancelColor,
  icon: CustomIcon,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    if (CustomIcon) return <CustomIcon size={48} />;

    switch (type) {
      case "success":
        return <CheckCircle size={48} />;
      case "error":
        return <AlertCircle size={48} />;
      case "warning":
        return <AlertTriangle size={48} />;
      case "question":
        return <HelpCircle size={48} />;
      default:
        return <Info size={48} />;
    }
  };

  const getColorClass = () => {
    switch (type) {
      case "success":
        return "alert-success";
      case "error":
        return "alert-error";
      case "warning":
        return "alert-warning";
      case "question":
        return "alert-question";
      default:
        return "alert-info";
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const alertContent = (
    <div className="modern-alert-overlay" onClick={onClose}>
      <div
        className={`modern-alert-container ${getColorClass()}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="alert-close-btn"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="alert-icon-wrapper">
          <div className="alert-icon">{getIcon()}</div>
        </div>

        {/* Content */}
        <div className="alert-content">
          <h2 className="alert-title">{title}</h2>
          {message &&
            (typeof message === "string" && message.includes("<") ? (
              <div
                className="alert-html"
                dangerouslySetInnerHTML={{ __html: message }}
              />
            ) : (
              <p className="alert-message">{message}</p>
            ))}
        </div>

        {/* Actions */}
        <div className="alert-actions">
          {showCancel && (
            <button
              className="alert-btn alert-btn-cancel"
              onClick={onClose}
              style={cancelColor ? { background: cancelColor } : {}}
            >
              {cancelText}
            </button>
          )}
          <button
            className="alert-btn alert-btn-confirm"
            onClick={handleConfirm}
            style={confirmColor ? { background: confirmColor } : {}}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(alertContent, document.body);
};

export default ModernAlert;
