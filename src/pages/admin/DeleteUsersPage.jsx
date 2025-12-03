import React, { useEffect, useState } from "react";
import withAdminGuard from "../../hooks/withAdminGuard.jsx";
import { useMinimumLoadingTime } from "../../hooks/useMinimumLoading.jsx";
import usePermissions from "../../hooks/usePermissions.jsx";
import RestrictedButton from "../../components/RestrictedButton.jsx";
import withSessionGuard from "../../hooks/withSessionGuard.jsx";
import HeaderTitle from "../../components/HeaderTitle.jsx";
import LoadingScreen from "../../components/LoadingScreen";
import { getUsers, deleteUser } from "../../utils/api.js";
import Cafetera from "../../components/Cafetera.jsx";
import { useModernAlert } from "../../hooks/useModernAlert.jsx";
import "../../App.css";
import {
  ArrowBigLeft,
  ArrowBigRight,
  Mail,
  Search,
  ShieldUser,
  Trash2,
  User,
  Users,
  Lock,
  Eye,
} from "lucide-react";

const DeleteUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const showLoading = useMinimumLoadingTime(loading, 1000);
  const { alert, confirm, success, error } = useModernAlert();
  const permissions = usePermissions();
  const pageSize = 20;

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsers("");
        setUsers(data.users || []);
      } catch (err) {
        error("Error", "No se pudieron cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    try {
      const data = await getUsers(searchTerm);
      setUsers(data.users || []);
    } catch (err) {
      error("Error", "No se pudieron buscar usuarios");
    } finally {
      setTimeout(() => setSearched(false), 1000);
    }
  };

  const handleDelete = async (userId) => {
    const result = await confirm(
      "¿Eliminar usuario?",
      "Esta acción no se puede deshacer.",
      {
        okText: "Sí, eliminar",
        cancelText: "Cancelar",
      }
    );

    if (!result.isConfirmed) return;

    try {
      await deleteUser(userId);
      await success("Éxito", "Usuario eliminado");
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      error("Error", "No se pudo eliminar el usuario");
    }
  };

  const handleReset = async () => {
    setSearchTerm("");
    setLoading(true);
    try {
      const data = await getUsers("");
      setUsers(data.users || []);
    } catch (err) {
      error("Error", "No se pudieron cargar los usuarios");
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

  // Contar usuarios por rol
  const usersByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  if (showLoading) {
    return <LoadingScreen title="Cargando usuarios..." />;
  }

  return (
    <div className="admin-orders-page">
      {permissions.isViewer && (
        <div className="viewer-banner">
          <Lock size={18} />
          <span>Modo de solo lectura - No puedes realizar modificaciones</span>
        </div>
      )}
      <HeaderTitle
        title="Borrar Usuarios"
        subtitle="Filtra y borra los usuarios registrados"
        backPath="/admin"
        backText="Volver al Dashboard"
      />

      {/* Barra de búsqueda moderna */}
      <div className="search-section">
        <form className="search-form-modern" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              className="search-input-modern"
              placeholder="Buscar por correo electrónico o nombre..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-btn"
                type="button"
                onClick={handleReset}
                aria-label="Limpiar búsqueda"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="search-btn-modern"
            onClick={handleSearch}
            disabled={searched}
          >
            <Search className={searched ? "spinning" : ""} size={20} />
            <span>Buscar</span>
          </button>
        </form>

        {/* Estadísticas rápidas */}
        {users.length > 0 && (
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon users-icon">
                <Users strokeWidth="2.5px" />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Usuarios</span>
                <span className="stat-value">{users.length}</span>
              </div>
            </div>

            {Object.entries(usersByRole).map(([role, count]) => (
              <div className="stat-card" key={role}>
                <div
                  className={`stat-icon ${
                    role === "admin" ? "admin-icon" : "customer-icon"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {role === "admin" ? (
                      <ShieldUser strokeWidth="2.5px" />
                    ) : role === "viewer" ? (
                      <Eye strokeWidth="2.5px" />
                    ) : (
                      <User strokeWidth="2.5px" />
                    )}
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-label">
                    {role === "admin"
                      ? "Administradores"
                      : role === "viewer"
                      ? "Visualizadores"
                      : "Clientes"}
                  </span>
                  <span className="stat-value">{count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Contenido principal */}
      {searched ? (
        <div className="loading-products">
          <div className="loading-content">
            <div className="spinner"></div>
            <h3>Cargando usuarios...</h3>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="no-orders-modern">
          <div className="no-orders-content">
            <Cafetera />
            <h3>No se encontraron usuarios</h3>
            <p>
              {loading
                ? "Intenta con otro correo o nombre"
                : "No hay usuarios registrados"}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Grid de usuarios */}
          <div className="users-grid">
            {paginatedUsers.map((user, index) => (
              <div
                key={user.id}
                className="user-card-modern"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="user-card-header">
                  <div className="user-avatar-large">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "Usuario"}
                        className="avatar-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <span
                      className="avatar-letter"
                      style={{
                        display: user.image ? "none" : "flex",
                      }}
                    >
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </span>
                  </div>

                  <span className={`role-badge role-${user.role}`}>
                    {user.role === "admin" ? (
                      <ShieldUser strokeWidth="2.5px" />
                    ) : user.role === "viewer" ? (
                      <Eye strokeWidth="2.5px" />
                    ) : (
                      <User strokeWidth="2.5px" />
                    )}
                    {user.role === "admin"
                      ? "Administrador"
                      : user.role === "viewer"
                      ? "Visualizador"
                      : "Cliente"}
                  </span>
                </div>

                <div className="user-card-body">
                  <h3 className="user-name-title">
                    {user.name || "Sin nombre"}
                  </h3>

                  <div className="user-detail-row">
                    <div className="detail-icon">
                      <Mail strokeWidth="2.5px" />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Correo electrónico</span>
                      <span className="detail-value">{user.email}</span>
                    </div>
                  </div>

                  <div className="user-detail-row">
                    <div className="detail-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">ID de Usuario</span>
                      <span className="detail-value user-id">#{user.id}</span>
                    </div>
                  </div>
                </div>

                <div className="user-actions">
                  <RestrictedButton
                    className="btn-delete-user"
                    requiredPermission="canManageUsers"
                    tooltipMessage="Solo administradores pueden eliminar usuarios"
                    onClick={() => handleDelete(user.id)}
                  >
                    <span className="button__text">Eliminar</span>
                    <span className="button__icon">
                      <Trash2 strokeWidth="2px" color="white" size={20} />
                    </span>
                  </RestrictedButton>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="pagination-modern">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="pagination-btn-modern"
                aria-label="Página anterior"
              >
                <ArrowBigLeft strokeWidth="2.5px" />
                Anterior
              </button>
              <div className="pagination-info">
                <span className="current-page">{currentPage}</span>
                <span className="separator">/</span>
                <span className="total-pages">{totalPages}</span>
              </div>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="pagination-btn-modern"
                aria-label="Página siguiente"
              >
                Siguiente
                <ArrowBigRight strokeWidth="2.5px" />
              </button>
            </div>
          )}
        </>
      )}
      {alert}
    </div>
  );
};

export default withSessionGuard(withAdminGuard(DeleteUsersPage));
