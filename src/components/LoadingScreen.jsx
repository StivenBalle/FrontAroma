import React from "react";
import "../styles/AdminStats.css";

const LoadingScreen = ({
  title = "Cargando datos...",
  subtitle = "Por favor espera",
}) => {
  return (
    <div className="stats-loading-container">
      <div className="loading-content">
        <div className="spinner-stats"></div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
