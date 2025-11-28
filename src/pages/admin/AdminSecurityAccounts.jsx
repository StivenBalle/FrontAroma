import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Activity,
  Download,
  RefreshCw,
  Ban,
  ArrowBigLeft,
  ArrowBigRight,
  MoveLeft,
} from "lucide-react";
import withAdminGuard from "../../hooks/withAdminGuard.jsx";
import withSessionGuard from "../../hooks/withSessionGuard.jsx";
import { usePermissions } from "../../hooks/usePermissions.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import LockUserModal from "../../components/LockUserModal.jsx";
import RestrictedButton from "../../components/RestrictedButton.jsx";
import Swal from "sweetalert2";
import {
  getSecurityUsers,
  unlockUserAccount,
  lockUserAccount,
  resetUserAttempts,
} from "../../utils/api.js";
import "../../styles/AdminSecurity.css";

const AdminSecurityPanel = () => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadData = useCallback(
    async (isSearch = false) => {
      const MIN_LOAD_TIME = 1000;
      const startTime = Date.now();
      if (isSearch) {
        setLoadingTable(true);
      } else {
        setLoadingGlobal(true);
      }
      try {
        const data = await getSecurityUsers(
          searchTerm.trim(),
          filter,
          currentPage
        );
        setUsers(data.users || []);
        setStats(data.stats || {});
        setPagination(data.pagination || { page: 1, totalPages: 1 });
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setUsers([]);
        setStats({});
        Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = MIN_LOAD_TIME - elapsed;

        setTimeout(
          () => {
            if (isSearch) {
              setLoadingTable(false);
            } else {
              setLoadingGlobal(false);
            }
          },
          remaining > 0 ? remaining : 0
        );
      }
    },
    [searchTerm, filter, currentPage]
  );

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      loadData(true);
    } else {
      loadData(false);
    }
  }, [searchTerm]);

  const handleAction = async (action, id, name) => {
    try {
      await action(id);
      Swal.fire(
        "Éxito",
        `Acción realizada en ${name || "el usuario"}`,
        "success"
      );
      loadData();
    } catch (err) {
      Swal.fire("Error", "No se pudo completar la acción", "error");
    }
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  // Abrir modal de bloqueo
  const handleOpenLockModal = (user) => {
    setSelectedUser(user);
    setLockModalOpen(true);
  };

  // Confirmar bloqueo desde el modal
  const handleConfirmLock = async (lockData) => {
    try {
      await lockUserAccount(selectedUser.id, {
        duration: lockData.duration,
        reason: lockData.reason,
        permanent: lockData.permanent,
      });

      setLockModalOpen(false);
      setSelectedUser(null);

      const lockTypeText = lockData.permanent
        ? "permanentemente"
        : `temporalmente por ${lockData.duration} minutos`;

      await Swal.fire({
        icon: "success",
        title: "Usuario bloqueado",
        html: `
          <p><strong>${selectedUser.name}</strong> ha sido bloqueado ${lockTypeText}.</p>
          <p style="margin-top: 10px; color: #666;">
            Será desconectado automáticamente en su próxima acción.
          </p>
        `,
        confirmButtonText: "Entendido",
      });

      loadData();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo bloquear al usuario. Intenta nuevamente.",
      });
    }
  };

  // Desbloquear usuario con confirmación
  const handleUnlockUser = async (user) => {
    const result = await Swal.fire({
      title: `¿Desbloquear a ${user.name}?`,
      html: `
        <p>El usuario podrá acceder inmediatamente a su cuenta.</p>
        <p style="margin-top: 10px; color: #666;">
          Los intentos de login fallidos serán reseteados a 0.
        </p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, desbloquear",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#10b981",
    });

    if (result.isConfirmed) {
      await handleAction(() => unlockUserAccount(user.id), user.id, user.name);
    }
  };

  const getStatusBadge = (user) => {
    if (user.is_permanently_locked) {
      return (
        <span className="status-badge permanent">Bloqueado Permanente</span>
      );
    }

    const isLocked =
      user.is_locked ||
      (user.locked_until && new Date(user.locked_until) > new Date());

    if (isLocked) {
      return <span className="status-badge locked">Bloqueado Temporal</span>;
    }

    if (user.login_attempts >= 3) {
      return <span className="status-badge warning">En riesgo</span>;
    }

    return <span className="status-badge success">Normal</span>;
  };

  const getRiskLevel = (attempts) => {
    if (attempts >= 5) return { level: "Crítico", color: "#dc2626" };
    if (attempts >= 3) return { level: "Alto", color: "#f59e0b" };
    if (attempts >= 1) return { level: "Moderado", color: "#3b82f6" };
    return { level: "Bajo", color: "#10b981" };
  };

  if (loadingGlobal) {
    return <LoadingScreen title="Cargando panel de seguridad..." />;
  }

  return (
    <div className="admin-security-panel">
      {/* Banner de rol (solo para viewers) */}
      {permissions.isViewer && (
        <div className="viewer-banner">
          <Lock size={18} />
          <span>Modo de solo lectura - No puedes realizar modificaciones</span>
        </div>
      )}

      {/* Modal de bloqueo */}
      <LockUserModal
        isOpen={lockModalOpen}
        onClose={() => {
          setLockModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmLock}
        userName={selectedUser?.name || "Usuario"}
      />

      {/* Header */}
      <div className="panel-header">
        <div className="header-content">
          <div className="header-title">
            <Shield className="header-icon" />
            <div>
              <h2>Panel de Seguridad</h2>
              <p>Gestión de cuentas y monitoreo en tiempo real</p>
            </div>
          </div>
          <button
            className="btn-refresh"
            onClick={loadData}
            disabled={loadingTable}
          >
            <RefreshCw className={loadingTable ? "spinning" : ""} size={20} />
            <span>Actualizar</span>
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="back-btn-modern"
          >
            <MoveLeft strokeWidth="2.5px" />
            Volver al dashboard
          </button>
        </div>
      </div>

      {stats && (
        <div className="metrics-grid">
          <div className="metric-card permanent-metric">
            <div className="metric-icon">
              <Lock strokeWidth="2.5px" color="#fff" />
            </div>
            <div className="metric-content">
              <span className="metric-label">Permanentes</span>
              <span className="metric-value">
                {stats.permanently_locked || 0}
              </span>
            </div>
          </div>

          <div className="metric-card sales-metric">
            <div className="metric-icon">
              <Clock strokeWidth="2.5px" color="#f10f0fff" />
            </div>
            <div className="metric-content">
              <span className="metric-label">Temporales</span>
              <span className="metric-value">{stats.locked_accounts || 0}</span>
            </div>
          </div>

          <div className="metric-card products-metric">
            <div className="metric-icon">
              <AlertTriangle strokeWidth="2.5px" color="#f57c0bff" />
            </div>
            <div className="metric-content">
              <span className="metric-label">Con Intentos</span>
              <span className="metric-value">
                {stats.accounts_with_attempts || 0}
              </span>
            </div>
          </div>

          <div className="metric-card users-metric">
            <div className="metric-icon">
              <Activity strokeWidth="2.5px" color="#2274faff" />
            </div>
            <div className="metric-content">
              <span className="metric-label">Fallidos Hoy</span>
              <span className="metric-value">
                {stats.failed_logins_today || 0}
              </span>
            </div>
          </div>

          <div className="metric-card average-metric">
            <div className="metric-icon">
              <CheckCircle strokeWidth="2.5px" color="#10b93dff" />
            </div>
            <div className="metric-content">
              <span className="metric-label">Exitosos Hoy</span>
              <span className="metric-value">
                {stats.successful_logins_today || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Controles */}
      <div className="controls-section">
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
            placeholder="Buscar por nombre o email"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => {
              setFilter("all");
              setCurrentPage(1);
            }}
          >
            <User size={18} /> Todos
          </button>
          <button
            className={`filter-btn permanent ${
              filter === "permanent" ? "active" : ""
            }`}
            onClick={() => {
              setFilter("permanent");
              setCurrentPage(1);
            }}
          >
            <Lock size={18} /> Permanentes
          </button>
          <button
            className={`filter-btn ${filter === "locked" ? "active" : ""}`}
            onClick={() => {
              setFilter("locked");
              setCurrentPage(1);
            }}
          >
            <Clock size={18} /> Temporales
          </button>
          <button
            className={`filter-btn ${filter === "suspicious" ? "active" : ""}`}
            onClick={() => {
              setFilter("suspicious");
              setCurrentPage(1);
            }}
          >
            <AlertTriangle size={18} /> Sospechosos
          </button>
        </div>
      </div>

      {/* Tabla */}
      {loadingTable ? (
        <div className="loading-products">
          <div className="loading-content">
            <div className="spinner"></div>
            <h3>Cargando usuarios...</h3>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <Shield size={64} />
          <h3>No hay usuarios</h3>
          <p>Prueba con otro filtro</p>
        </div>
      ) : (
        <div className="table-wrapper-modern">
          <table className="admin-security-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Intentos</th>
                <th>Riesgo</th>
                <th>Último Fallido</th>
                <th>Bloqueo Hasta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const risk = getRiskLevel(user.login_attempts || 0);
                const isPermanentlyLocked = user.is_permanently_locked;
                const isTemporarilyLocked =
                  user.is_locked ||
                  (user.locked_until &&
                    new Date(user.locked_until) > new Date());
                const isLocked = isPermanentlyLocked || isTemporarilyLocked;

                return (
                  <tr
                    key={user.id}
                    className={`
                    ${isPermanentlyLocked ? "permanent-locked-row" : ""}
                    ${
                      isTemporarilyLocked && !isPermanentlyLocked
                        ? "locked-row"
                        : ""
                    }
                  `}
                  >
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          <span className="avatar-letter">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="user-info">
                          <span className="user-name">
                            {user.name || "Sin nombre"}
                          </span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{getStatusBadge(user)}</td>
                    <td>
                      <span className="attempts-badge">
                        {user.login_attempts || 0}
                      </span>
                    </td>
                    <td>
                      <span
                        className="risk-badge"
                        style={{
                          backgroundColor: `${risk.color}20`,
                          color: risk.color,
                        }}
                      >
                        {risk.level}
                      </span>
                    </td>
                    <td>
                      {user.last_failed_login
                        ? new Date(user.last_failed_login).toLocaleString(
                            "es-CO"
                          )
                        : "—"}
                    </td>
                    <td>
                      {isPermanentlyLocked ? (
                        <div className="permanent-lock-badge">
                          <Lock size={14} />
                          <span>Permanente</span>
                        </div>
                      ) : isTemporarilyLocked && user.remaining_minutes > 0 ? (
                        <div className="locked-info">
                          <Clock size={14} />
                          <span>
                            {Math.max(1, Math.ceil(user.remaining_minutes))} min
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <div className="actions-cell">
                        {/* Botones con permisos */}
                        {isLocked ? (
                          <RestrictedButton
                            className="btn-icon success"
                            onClick={() => handleUnlockUser(user)}
                            requiredPermission="canManageSecurity"
                            tooltipMessage="Solo administradores pueden desbloquear usuarios"
                            title="Desbloquear"
                          >
                            <Unlock size={18} />
                          </RestrictedButton>
                        ) : (
                          <RestrictedButton
                            className="btn-icon danger"
                            onClick={() => handleOpenLockModal(user)}
                            requiredPermission="canManageSecurity"
                            tooltipMessage="Solo administradores pueden bloquear usuarios"
                            title="Bloquear"
                          >
                            <Ban size={18} />
                          </RestrictedButton>
                        )}

                        {/* Reset de intentos */}
                        {user.login_attempts > 0 && !isLocked && (
                          <RestrictedButton
                            className="btn-icon warning"
                            onClick={() =>
                              handleAction(
                                () => resetUserAttempts(user.id),
                                user.id,
                                user.name
                              )
                            }
                            requiredPermission="canManageSecurity"
                            tooltipMessage={
                              isLocked
                                ? "No puedes resetear intentos porque la cuenta está bloqueada"
                                : "Solo administradores pueden resetear intentos"
                            }
                            disabled={isLocked || user.login_attempts === 0}
                            title="Resetear intentos"
                          >
                            <RefreshCw size={18} />
                          </RestrictedButton>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loadingTable}
          >
            <ArrowBigLeft /> Anterior
          </button>
          <span>
            Página {currentPage} de {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(pagination.totalPages, prev + 1)
              )
            }
            disabled={currentPage === pagination.totalPages || loadingTable}
          >
            Siguiente <ArrowBigRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default withSessionGuard(withAdminGuard(AdminSecurityPanel));
