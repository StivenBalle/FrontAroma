import { useState, useEffect } from "react";
import { getLogs, deleteLogs } from "../../utils/api.js";
import withAdminGuard from "../../hooks/withAdminGuard.jsx";
import withSessionGuard from "../../hooks/withSessionGuard.jsx";
import HeaderTitle from "../../components/HeaderTitle.jsx";
import { useMinimumLoadingTime } from "../../hooks/useMinimumLoading.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import Cafetera from "../../components/Cafetera.jsx";
import usePermissions from "../../hooks/usePermissions.jsx";
import Swal from "sweetalert2";
import "../../styles/AdminSecurity.css";
import {
  ArrowBigLeft,
  ArrowBigRight,
  Calendar1,
  MessageCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Hash,
  Settings,
  X,
  Logs,
  Lock,
  Download,
  BrushCleaning,
} from "lucide-react";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const pageSize = 15;
  const showLoading = useMinimumLoadingTime(loading, 1000);
  const permissions = usePermissions();

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [levelFilter, searchTerm, logs]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (levelFilter !== "ALL") {
        params.level = levelFilter;
      }

      const data = await getLogs(params);
      const sortedLogs = (data.logs || []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setLogs(sortedLogs);
      setFilteredLogs(sortedLogs);
    } catch (err) {
      console.error("Error cargando logs:", err);
      Swal.fire("Error", "No se pudieron cargar los logs", "error");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...logs];

    if (levelFilter && levelFilter !== "ALL") {
      result = result.filter((log) => log.level === levelFilter);
    }

    if (searchTerm && searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter((log) => {
        const messageMatch = log.message?.toLowerCase().includes(search);
        const detailsMatch = log.details
          ? JSON.stringify(log.details).toLowerCase().includes(search)
          : false;
        return messageMatch || detailsMatch;
      });
    }

    setFilteredLogs(result);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setSearchLoading(true);
    applyFilters();
    setTimeout(() => setSearchLoading(false), 800);
  };

  const handleReset = () => {
    setSearchTerm("");
    setLevelFilter("ALL");
    setCurrentPage(1);
  };

  const handleDeleteOldLogs = async () => {
    const { value } = await Swal.fire({
      title: "Eliminar logs antiguos",
      input: "number",
      inputLabel: "Eliminar logs de hace más de (días)",
      inputValue: 30,
      inputAttributes: {
        min: 1,
        max: 365,
        step: 1,
      },
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      inputValidator: (v) => {
        const num = parseInt(v);
        if (!v || num < 1) {
          return "Ingresa un número válido mayor a 0";
        }
        if (num > 365) {
          return "El máximo es 365 días";
        }
        return null;
      },
    });

    if (value) {
      try {
        const res = await deleteLogs(value);
        Swal.fire(
          "Éxito",
          `Se eliminaron ${res.deleted} logs antiguos`,
          "success"
        );
        fetchLogs();
      } catch {
        Swal.fire("Error", "No se pudieron eliminar los logs", "error");
      }
    }
  };

  const getLevelClass = (level) => {
    switch (level) {
      case "ERROR":
        return "level-error";
      case "WARNING":
        return "level-warning";
      case "INFO":
        return "level-info";
      default:
        return "";
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case "ERROR":
        return <AlertCircle color="red" />;
      case "WARNING":
        return <AlertTriangle color="orange" />;
      case "INFO":
        return <Info color="blue" />;
      default:
        return <Info color="black" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrevious = () => currentPage > 1 && setCurrentPage((c) => c - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage((c) => c + 1);

  if (showLoading)
    return <LoadingScreen title="Cargando logs del sistema..." />;

  return (
    <div className="admin-orders-page">
      {permissions.isViewer && (
        <div className="viewer-banner">
          <Lock size={18} />
          <span>Modo de solo lectura - No puedes realizar modificaciones</span>
        </div>
      )}
      <HeaderTitle
        title="Gestión de Logs"
        subtitle="Monitorea y administra los logs del sistema"
        backPath="/admin"
        backText="Volver al Dashboard"
      />

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
              placeholder="Buscar en logs..."
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

          {/* Filtro por nivel */}
          <select
            className="level-filter"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            <option value="ALL">Todos los niveles</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
          </select>

          <button
            type="button"
            onClick={handleDeleteOldLogs}
            className="filter-btn"
          >
            <BrushCleaning strokeWidth="2.5px" />
            Limpiar Antiguos
          </button>

          <button type="button" className="filter-btn">
            <Download strokeWidth="2.5px" />
            Exportar Logs
          </button>
        </form>

        {/* Estadísticas rápidas */}
        {logs.length > 0 && (
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon orders-icon">
                <Logs strokeWidth="2.5px" />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Logs</span>
                <span className="stat-value">{logs.length}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: "#fee" }}>
                <AlertCircle strokeWidth="2.5px" color="#dc2626" />
              </div>
              <div className="stat-content">
                <span className="stat-label">Errores</span>
                <span className="stat-value">
                  {logs.filter((l) => l.level === "ERROR").length}
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
                <AlertTriangle strokeWidth="2.5px" color="#d97706" />
              </div>
              <div className="stat-content">
                <span className="stat-label">Warnings</span>
                <span className="stat-value">
                  {logs.filter((l) => l.level === "WARNING").length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {searchLoading ? (
        <div className="loading-products">
          <div className="loading-content">
            <div className="spinner"></div>
            <h3>Buscando logs...</h3>
          </div>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="no-orders-modern">
          <div className="no-orders-content">
            <Cafetera />
            <h3>No se encontraron Logs</h3>
            <p>
              {logs.length === 0
                ? "No hay logs registrados en el sistema"
                : "No hay logs que coincidan con tu búsqueda"}
            </p>
            {logs.length > 0 && (
              <button onClick={handleReset} className="search-btn-modern">
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="table-wrapper-modern">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>
                    <div className="th-content">
                      <Hash strokeWidth="2.5px" />
                      ID
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <Settings strokeWidth="2.5px" />
                      Nivel
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <MessageCircle strokeWidth="2.5px" />
                      Mensaje
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <Calendar1 strokeWidth="2.5px" />
                      Fecha
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <Info strokeWidth="2.5px" />
                      Acciones
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log, i) => (
                  <tr key={log.id} style={{ animationDelay: `${i * 0.03}s` }}>
                    <td>
                      <span className="order-id-badge">#{log.id}</span>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {getLevelIcon(log.level)}
                        <span
                          style={{
                            color:
                              log.level === "ERROR"
                                ? "#dc2626"
                                : log.level === "WARNING"
                                ? "#d97706"
                                : "#2563eb",
                            fontWeight: "bold",
                          }}
                        >
                          {log.level}
                        </span>
                      </div>
                    </td>
                    <td style={{ maxWidth: "400px" }}>
                      <p
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                          color: "#374151",
                          margin: 0,
                        }}
                      >
                        {log.message}
                      </p>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        {formatDate(log.created_at)}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="track-order-btn admin-track-btn"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

      {selectedLog && (
        <div
          className="modal-overlay-logs"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="modal-content-logs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-logs">
              <h2>Detalles del Log</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="close-modal-btn"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body-logs">
              <div className="detail-row-logs">
                <strong>ID:</strong> {selectedLog.id}
              </div>
              <div className="detail-row-logs">
                <strong>Nivel:</strong>
                <span
                  className={`level-badge ${getLevelClass(selectedLog.level)}`}
                >
                  {selectedLog.level}
                </span>
              </div>
              <div className="detail-row-logs">
                <strong>Fecha:</strong> {formatDate(selectedLog.created_at)}
              </div>
              <div className="detail-row-logs">
                <strong>Mensaje:</strong>
                <div className="detail-message">{selectedLog.message}</div>
              </div>
              {selectedLog.details && (
                <div className="detail-row-logs">
                  <strong>Detalles:</strong>
                  <pre className="detail-json">
                    {typeof selectedLog.details === "string"
                      ? JSON.stringify(JSON.parse(selectedLog.details), null, 2)
                      : JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withSessionGuard(withAdminGuard(AdminLogs));
