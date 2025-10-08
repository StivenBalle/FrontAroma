import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const PhoneModal = () => {
  const { showPhoneModal, updatePhoneNumber, setShowPhoneModal } = useAuth();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  if (!showPhoneModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!phone.trim()) {
      setError("El teléfono es obligatorio");
      return;
    } else if (!/^\d{7,15}$/.test(phone)) {
      setError("El teléfono debe tener entre 7 y 15 dígitos");
      return;
    }

    updatePhoneNumber(phone);
  };

  return (
    <div id="overlay" className="overlay">
      <div className="form-container-phone">
        <button
          className="close-btn-phone"
          onClick={() => setShowPhoneModal(false)}
        >
          ✕
        </button>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Ingresa tu número de teléfono</h2>
          <p>
            Necesitamos tu número de teléfono para enviarte notificaciones de
            compras vía SMS. Esto asegura que recibas actualizaciones
            importantes sobre tus pedidos.
          </p>
          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ingresa tu teléfono"
            />
            {error && <span className="error">{error}</span>}
          </div>
          <button type="submit" className="submit-btn">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhoneModal;
