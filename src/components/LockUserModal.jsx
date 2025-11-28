import React, { useState } from "react";
import { X, Lock, Clock, AlertTriangle } from "lucide-react";
import "../styles/AdminSecurity.css";

const LockUserModal = ({ isOpen, onClose, onConfirm, userName }) => {
  const [lockType, setLockType] = useState("temporary");
  const [duration, setDuration] = useState(15);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!reason.trim()) {
      newErrors.reason = "La razón es obligatoria";
    } else if (reason.trim().length < 10) {
      newErrors.reason = "La razón debe tener al menos 10 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await onConfirm({
        lockType,
        duration: lockType === "temporary" ? duration : null,
        reason: reason.trim(),
        permanent: lockType === "permanent",
      });

      // Reset form
      setLockType("temporary");
      setDuration(15);
      setReason("");
      setErrors({});
    } catch (error) {
      console.error("Error al bloquear:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setLockType("temporary");
      setDuration(15);
      setReason("");
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-lock" onClick={handleClose}>
      <div
        className="modal-container-lock"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header-lock">
          <div className="modal-header-content">
            <Lock className="modal-icon" />
            <div>
              <h2>Bloquear usuario</h2>
              <p>{userName}</p>
            </div>
          </div>
          <button
            className="close-modal-btn"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body-lock">
            {/* Tipo de bloqueo */}
            <div className="form-group">
              <label className="form-label">
                <Lock size={18} />
                Tipo de bloqueo
              </label>
              <div className="lock-type-buttons">
                <button
                  type="button"
                  className={`lock-type-btn ${
                    lockType === "temporary" ? "active" : ""
                  }`}
                  onClick={() => setLockType("temporary")}
                  disabled={isSubmitting}
                >
                  <Clock size={20} />
                  <div>
                    <span className="btn-title">Temporal</span>
                    <span className="btn-subtitle">Con duración definida</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`lock-type-btn permanent ${
                    lockType === "permanent" ? "active" : ""
                  }`}
                  onClick={() => setLockType("permanent")}
                  disabled={isSubmitting}
                >
                  <Lock size={20} />
                  <div>
                    <span className="btn-title">Permanente</span>
                    <span className="btn-subtitle">Indefinido</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Duración (solo temporal) */}
            {lockType === "temporary" && (
              <div className="form-group">
                <label className="form-label">
                  <Clock size={18} />
                  Duración del bloqueo
                </label>
                <select
                  className="form-select"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  disabled={isSubmitting}
                >
                  <option value={1}>1 minutos</option>
                  <option value={15}>15 minutos</option>
                  <option value={30}>30 minutos</option>
                  <option value={60}>1 hora</option>
                  <option value={240}>4 horas</option>
                  <option value={1440}>24 horas</option>
                  <option value={10080}>7 días</option>
                </select>
              </div>
            )}

            {/* Razón del bloqueo */}
            <div className="form-group">
              <label className="form-label">
                <AlertTriangle size={18} />
                Razón del bloqueo <span className="required">*</span>
              </label>
              <textarea
                className={`form-textarea ${errors.reason ? "error" : ""}`}
                placeholder="Describe detalladamente la razón del bloqueo..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (errors.reason) {
                    setErrors({ ...errors, reason: null });
                  }
                }}
                rows={4}
                disabled={isSubmitting}
              />
              {errors.reason && (
                <span className="error-message-lock">{errors.reason}</span>
              )}
              <span className="character-count">
                {reason.length} caracteres
              </span>
            </div>

            {/* Warning box */}
            <div
              className={`warning-box ${
                lockType === "permanent" ? "permanent" : ""
              }`}
            >
              {lockType === "temporary" ? (
                <>
                  <AlertTriangle size={20} />
                  <div>
                    <strong>Bloqueo temporal</strong>
                    <p>
                      El usuario será desconectado automáticamente y no podrá
                      acceder hasta que expire el tiempo seleccionado.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Lock size={20} />
                  <div>
                    <strong>Bloqueo permanente</strong>
                    <p>
                      El usuario será bloqueado INDEFINIDAMENTE. Solo podrás
                      desbloquearlo manualmente. Este es un bloqueo muy
                      restrictivo.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer-lock">
            <button
              type="button"
              className="btn btn-cancel-lock"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn btn-confirm ${
                lockType === "permanent" ? "permanent" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-small"></div>
                  Bloqueando...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Bloquear cuenta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LockUserModal;
