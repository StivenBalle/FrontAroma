import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import logoCafe from "../assets/LogoCafe.png";
import Cafetera from "./Cafetera";
import "../App.css";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      icon: "error",
      title: "¡Página no encontrada!",
      text: "Lo sentimos, la página que buscas no existe.",
      confirmButtonText: "Volver al inicio",
      confirmButtonColor: "#4a2c2a",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      }
    });
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
    </div>
  );
};

export default NotFound;
