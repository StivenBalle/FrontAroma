import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, updateUserRole } from "../api.js";
import withAdminGuard from "../hocs/withAdminGuard.jsx";
import Cafetera from "../components/Cafetera.jsx";
import Swal from "sweetalert2";
import "../App.css";

const ChangeRolePageInner = () => {
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

  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    Swal.fire({
      icon: "question",
      title: `¿Cambiar rol a ${newRole}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateUserRole(userId, newRole);
          Swal.fire("Éxito", `Rol cambiado a ${newRole}`, "success");
          setUsers(
            users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
          );
        } catch (err) {
          Swal.fire("Error", "No se pudo cambiar el rol", "error");
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
        <h2>Cambiar Rol de Usuario</h2>
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
                className="change-role-btn"
                onClick={() => handleChangeRole(user.id, user.role)}
              >
                Cambiar a {user.role === "admin" ? "User" : "Admin"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default withAdminGuard(ChangeRolePageInner);
