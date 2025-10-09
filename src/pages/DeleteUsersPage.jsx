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
        <h2>Borrar Usuario</h2>
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
            <div key={user.id} className="user-card">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Rol:</strong> {user.role}
                </p>
              </div>

              <div className="user-actions">
                {/* Botón de eliminar (con tu estilo) */}
                <button
                  className="btn-delete-user"
                  type="button"
                  onClick={() => handleDelete(user.id)}
                >
                  <span className="button__text">Eliminar</span>
                  <span className="button__icon">
                    <svg
                      className="svg"
                      height="512"
                      viewBox="0 0 512 512"
                      width="512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
                        style={{
                          fill: "none",
                          stroke: "#fff",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: "32px",
                        }}
                      ></path>
                      <line
                        style={{
                          stroke: "#fff",
                          strokeLinecap: "round",
                          strokeMiterlimit: 10,
                          strokeWidth: "32px",
                        }}
                        x1="80"
                        x2="432"
                        y1="112"
                        y2="112"
                      ></line>
                      <path
                        d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
                        style={{
                          fill: "none",
                          stroke: "#fff",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: "32px",
                        }}
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
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

export default withAdminGuard(DeleteUsersPage);
