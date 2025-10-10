import React from "react";
import { useNavigate } from "react-router-dom";
import withAdminGuard from "../hocs/withAdminGuard.jsx";
import "../App.css";

const AdminOrdersInner = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <h2>Panel de Administración</h2>
      <div className="admin-cards-container">
        {/* Card 1: Buscar Compras */}
        <button
          className="admin-card-button stats-card"
          onClick={() => handleNavigate("/admin/orders")}
        >
          <div className="card-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Buscar Compras</h2>
          <p>Ver y filtrar historial de órdenes</p>
        </button>

        {/* Card 2: Buscar Usuario */}
        <button
          className="admin-card-button stats-card"
          onClick={() => handleNavigate("/admin/users/search")}
        >
          <div className="card-icon">
            <svg
              width="48"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Buscar Usuario</h2>
          <p>Localizar usuarios por nombre o email</p>
        </button>

        {/* Card 3: Borrar Usuario */}
        <button
          className="admin-card-button stats-card"
          onClick={() => handleNavigate("/admin/users/delete")}
        >
          <div className="card-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6H5H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Borrar Usuario</h2>
          <p>Eliminar cuentas de usuarios</p>
        </button>

        {/* Card 4: Cambiar Rol */}
        <button
          className="admin-card-button stats-card"
          onClick={() => handleNavigate("/admin/users/role")}
        >
          <div className="card-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 17C9.238 17 7 14.762 7 12C7 9.238 9.238 7 12 7C14.762 7 17 9.238 17 12C17 14.762 14.762 17 12 17Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Cambiar Rol de Usuario</h2>
          <p>Promover o degradar a admin/user</p>
        </button>

        {/* 🆕 Card 5: Estadísticas */}
        <button
          className="admin-card-button stats-card"
          onClick={() => handleNavigate("/admin/stats")}
        >
          <div className="card-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 17H7V21H3V17ZM9 13H13V21H9V13ZM15 9H19V21H15V9Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Estadísticas</h2>
          <p>Ventas, productos y usuarios nuevos</p>
        </button>
      </div>
    </div>
  );
};

export default withAdminGuard(AdminOrdersInner);
