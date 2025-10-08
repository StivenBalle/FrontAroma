import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import bolsaCafe from "../assets/LogoCafe.png";
import { getPurchaseDetails } from "../api.js";
import "../App.css";

const Success = () => {
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("❌ Error cargando detalles:", err.message);
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

  if (loading) {
    return (
      <div className="loading-products">
        <div className="loading-content">
          <div className="spinner"></div>
          <h3>Cargando detalles de tu compra...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="success">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="succes-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="success-prompt-wrap">
            <h3 className="success-prompt-heading">
              ¡Gracias por tu compra! 🙌
            </h3>
            <div className="success-prompt-prompt">
              {purchase ? (
                <>
                  <div className="purchase-item">
                    <img
                      src={purchase.image || bolsaCafe}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                        objectFit: "cover",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    />
                  </div>
                  <p>
                    <b>Producto:</b> {purchase.producto}
                  </p>
                  <p>
                    <b>Precio:</b> ${purchase.precio}
                  </p>
                  <p>
                    <b>Comprador:</b> {purchase.usuario}
                  </p>
                  <p>
                    <b>Email:</b> {purchase.email}
                  </p>
                  <p>
                    <b>Teléfono:</b> {purchase.phone || "No disponible"}
                  </p>
                  <p>
                    <b>Dirección:</b>{" "}
                    {purchase.shipping_address?.line1 || "No disponible"}
                  </p>
                  <p>
                    <b>Fecha:</b> {new Date(purchase.fecha).toLocaleString()}
                  </p>
                  <p>
                    <b>Estado:</b> {purchase.status}
                  </p>
                  <hr />
                  <p>
                    <b>Contacto vendedor:</b> soporte@cafearoma.com
                  </p>
                </>
              ) : (
                <p>No se encontraron los detalles de tu compra.</p>
              )}
            </div>

            <div className="success-button-container">
              <button
                type="button"
                className="success-button-main"
                onClick={() => navigate("/")}
              >
                Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
