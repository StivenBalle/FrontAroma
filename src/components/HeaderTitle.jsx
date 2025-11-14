import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { MoveLeft } from "lucide-react";

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
        <MoveLeft strokeWidth="2.5px" />
        {backText}
      </button>
    </div>
  );
};

export default HeaderTitle;
