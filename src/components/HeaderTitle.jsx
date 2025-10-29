import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const HeaderTitle = ({
  title = "Título de página",
  subtitle = "Subtítulo descriptivo",
  backPath = "/",
  backText = "Volver al inicio",
}) => {
  const navigate = useNavigate();

  return (
    <div className="admin-page-header">
      <div className="header-left">
        <h2 className="admin-page-title">{title}</h2>
        <p className="admin-page-subtitle">{subtitle}</p>
      </div>

      <button onClick={() => navigate(backPath)} className="back-btn-modern">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {backText}
      </button>
    </div>
  );
};

export default HeaderTitle;
