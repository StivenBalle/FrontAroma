import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import withAdminGuard from "../hocs/withAdminGuard.jsx";
import { getUsers, deleteUser } from "../api.js";
import Cafetera from "../components/Cafetera.jsx";
import Swal from "sweetalert2";
import "../App.css";

const DeleteUsersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getUsers(searchTerm);
      setUsers(data.users || []);
    } catch (err) {
      Swal.fire("Error", "No se pudieron buscar usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    Swal.fire({
      icon: "warning",
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(userId);
          Swal.fire("Éxito", "Usuario eliminado", "success");
          setUsers(users.filter((u) => u.id !== userId));
        } catch (err) {
          Swal.fire("Error", "No se pudo eliminar el usuario", "error");
        }
      }
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setUsers([]);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Borrar Usuario</h2>
        <button onClick={() => navigate("/admin")} className="back-btn">
          ← Volver al Dashboard
        </button>
      </div>
      <form className="form_orders" onSubmit={handleSearch}>
        <button type="submit"> {/* SVG search */} </button>
        <input
          className="input_search"
          placeholder="Buscar por correo o nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="reset" type="reset" onClick={handleReset}>
          {" "}
          {/* SVG reset */}{" "}
        </button>
      </form>
      {loading ? (
        <div className="loading-products"> {/* Spinner */} </div>
      ) : users.length === 0 ? (
        <div className="text_no_orders">
          <Cafetera />
          <p>No se encontraron usuarios.</p>
        </div>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email}) - Rol: {user.role}
              <button
                className="delete-btn"
                onClick={() => handleDelete(user.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default withAdminGuard(DeleteUsersPage);
