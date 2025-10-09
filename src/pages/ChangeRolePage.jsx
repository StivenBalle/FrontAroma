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
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsers("");
        setUsers(data.users || []);
      } catch (err) {
        Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
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

  const handleReset = async () => {
    setSearchTerm("");
    setSearched(false);
    setLoading(true);
    try {
      const data = await getUsers("");
      setUsers(data.users || []);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Cambiar Rol de Usuario</h2>
        <button onClick={() => navigate("/admin")} className="back-btn">
          ← Volver al Dashboard
        </button>
      </div>
      <form className="form_orders" onSubmit={handleSearch}>
        <button type="submit"></button>
        <input
          className="input_search"
          placeholder="Buscar por correo o nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="reset" type="reset" onClick={handleReset}></button>
      </form>

      {loading ? (
        <div className="loading-products"></div>
      ) : users.length === 0 && searched ? (
        <div className="text_no_orders">
          <Cafetera />
          <p>No se encontraron usuarios.</p>
        </div>
      ) : (
        <ul className="user-list">
          {paginatedUsers.map((user) => (
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
      <div className="pagination">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          ⇦
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          ⇨
        </button>
      </div>
    </div>
  );
};

export default withAdminGuard(ChangeRolePageInner);
