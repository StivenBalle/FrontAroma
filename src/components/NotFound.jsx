import React, { useEffect } from "react";
import { useModernAlert } from "../hooks/useModernAlert.jsx";
import { useNavigate } from "react-router-dom";
import logoCafe from "../assets/LogoCafe.png";
import Cafetera from "./Cafetera";
import "../App.css";

const NotFound = () => {
  const navigate = useNavigate();
  const { alert, error } = useModernAlert();

  useEffect(() => {
    error(
      "¡Página no encontrada!",
      "Lo sentimos, la página que buscas no existe."
    );
  }, [navigate]);

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <img
          src={logoCafe}
          alt="Café Aroma de la Serranía"
          className="not-found-img"
        />
        <h3>¡Ups! Página no encontrada</h3>
        <div className="loader">
          <Cafetera />
        </div>
        <p>
          La página que buscas no existe. Vuelve al inicio para explorar
          nuestros productos ☕
        </p>
        <button className="btn-comprar" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
      {alert}
    </div>
  );
};

export default NotFound;
