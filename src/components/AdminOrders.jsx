import React from "react";
import { useNavigate } from "react-router-dom";
import withAdminGuard from "../hooks/withAdminGuard.jsx";
import withSessionGuard from "../hooks/withSessionGuard";
import "../App.css";
import {
  ChartColumnBig,
  CircleUser,
  Search,
  Trash2,
  UserSearch,
  UserStar,
} from "lucide-react";

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
            <Search strokeWidth="2.5px" size={40} />
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
            <UserSearch strokeWidth="2.5px" size={40} />
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
            <Trash2 strokeWidth="2.5px" size={40} />
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
            <CircleUser strokeWidth="2.5px" size={40} />
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
            <ChartColumnBig strokeWidth="2.5px" size={40} />
          </div>
          <h2>Estadísticas</h2>
          <p>Ventas, productos y usuarios nuevos</p>
        </button>

        <button
          className="admin-card-button stats-card"
          onClick={() => handleNavigate("/admin/reviews")}
        >
          <div className="card-icon">
            <UserStar strokeWidth="2.5px" size={40} />
          </div>
          <h2>Reseñas</h2>
          <p>Revisa las reseñas que han dejado tus clientes</p>
        </button>
      </div>
    </div>
  );
};

export default withSessionGuard(withAdminGuard(AdminOrdersInner));
