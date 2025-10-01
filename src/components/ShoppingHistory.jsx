import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { getHistorial } from "../api.js";
import "../App.css";

const ShoppingHistory = ({ isOpen, toggleHistory }) => {
  const { user } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getHistorial();
        console.log("Historial cargado:", JSON.stringify(data, null, 2));
        setCompras(data.compras);
      } catch (err) {
        console.error("❌ Error fetching history:", err.message);
        Swal.fire(
          "Error",
          "No se pudo cargar el historial de compras",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="shopping-history-card">
      <h3>Historial de Compras</h3>
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando historial...</p>
        </div>
      ) : compras.length === 0 ? (
        <p>No hay compras registradas.</p>
      ) : (
        <div className="compras-container">
          {compras.map((compra) => (
            <div key={compra.id} className="compra-card">
              <p>
                <strong>ID:</strong> {compra.id}
              </p>
              <p>
                <strong>Producto:</strong> {compra.producto}
              </p>
              <p>
                <strong>Precio:</strong> ${Number(compra.precio).toFixed(2)}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(compra.fecha).toLocaleDateString("es-CO")}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span className={`status ${compra.status}`}>
                  {compra.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
      <button onClick={toggleHistory} className="close-history-btn">
        Cerrar
      </button>
    </div>
  );
};

export default ShoppingHistory;
