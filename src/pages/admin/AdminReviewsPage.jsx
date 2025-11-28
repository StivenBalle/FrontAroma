import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import withAdminGuard from "../../hooks/withAdminGuard.jsx";
import withSessionGuard from "../../hooks/withSessionGuard.jsx";
import HeaderTitle from "../../components/HeaderTitle.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import { useMinimumLoadingTime } from "../../hooks/useMinimumLoading.jsx";
import usePermissions from "../../hooks/usePermissions.jsx";
import Swal from "sweetalert2";
import { getReviews, getAdminOrders } from "../../utils/api.js";
import "../../App.css";
import logger from "../../utils/logger.js";
import {
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigRightDash,
  Calendar,
  Calendar1,
  ChartColumnBig,
  CircleX,
  Clock4,
  Handbag,
  Search,
  Star,
  X,
  Lock,
} from "lucide-react";

const AdminReviewsPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const showLoading = useMinimumLoadingTime(loading, 1000);
  const permissions = usePermissions();
  const pageSize = 12;

  // Estadísticas
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalReviews: 0,
    pendingReviews: 0,
    averageRating: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reviews, searchTerm, filterRating]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews();
      const dataOrders = await getAdminOrders();
      setReviews(data.reviews || []);
      setOrders(dataOrders.orders);

      // Calcular estadísticas
      const totalReviews = data.reviews?.length || 0;
      const totalOrders = dataOrders.orders?.length || 0;

      const deliveredOrders = dataOrders.orders.filter(
        (order) => order.status === "pendiente"
      );

      const cancelledOrders = dataOrders.orders.filter(
        (order) => order.status === "cancelado"
      ).length;

      const pendingReviews = deliveredOrders.filter(
        (order) => !data.reviews.some((review) => review.order_id === order.id)
      ).length;

      const avgRating =
        totalReviews > 0
          ? (
              data.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            ).toFixed(1)
          : 0;

      setStats({
        totalOrders,
        totalReviews,
        pendingReviews,
        cancelledOrders,
        averageRating: avgRating,
      });
    } catch (err) {
      logger.error("Error al cargar reseñas:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las reseñas",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reviews];

    // Filtrar por búsqueda (nombre, email o comentario)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.name?.toLowerCase().includes(term) ||
          review.email?.toLowerCase().includes(term) ||
          review.comment?.toLowerCase().includes(term)
      );
    }

    // Filtrar por calificación
    if (filterRating !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(filterRating)
      );
    }

    setFilteredReviews(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterRating("all");
  };

  const handleViewDetail = (review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 5:
        return "#10b981";
      case 4:
        return "#3b82f6";
      case 3:
        return "#f59e0b";
      case 2:
        return "#f97316";
      case 1:
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getRatingLabel = (rating) => {
    switch (rating) {
      case 5:
        return "Excelente";
      case 4:
        return "Muy bueno";
      case 3:
        return "Bueno";
      case 2:
        return "Regular";
      case 1:
        return "Malo";
      default:
        return "Sin calificar";
    }
  };

  // Paginación
  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (showLoading) {
    return <LoadingScreen title="Cargando reseñas..." />;
  }

  return (
    <div className="admin-reviews-container">
      {permissions.isViewer && (
        <div className="viewer-banner">
          <Lock size={18} />
          <span>Modo de solo lectura - No puedes realizar modificaciones</span>
        </div>
      )}
      <HeaderTitle
        title="Gestión de Reseñas"
        subtitle="Visualiza y administra las opiniones de tus clientes"
        backPath="/admin"
        backText="Volver al Dashboard"
      />

      {/* Barra de búsqueda */}
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
              placeholder="Buscar por nombre, email o comentario..."
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

          {/* Filtro por calificación */}
          <select
            className="rating-filter"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="all">Todas las calificaciones</option>
            <option value="5">⭐ 5 - Excelente</option>
            <option value="4">⭐ 4 - Muy bueno</option>
            <option value="3">⭐ 3 - Bueno</option>
            <option value="2">⭐ 2 - Regular</option>
            <option value="1">⭐ 1 - Malo</option>
          </select>

          <button type="submit" className="search-btn-modern">
            <Search strokeWidth="2.5px" />
            Buscar
          </button>
        </form>

        {/* Estadísticas rápidas */}
        <div className="quick-stats-reviews">
          <div className="stat-card-review">
            <div className="stat-icon orders-icon">
              <Handbag strokeWidth="2.5px" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Compras</span>
              <span className="stat-value">{orders.length}</span>
            </div>
          </div>

          <div className="stat-card-review">
            <div className="stat-icon reviews-icon">
              <Star strokeWidth="2.5px" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Reseñas Recibidas</span>
              <span className="stat-value">{stats.totalReviews}</span>
            </div>
          </div>

          <div className="stat-card-review">
            <div className="stat-icon pending-icon">
              <Clock4 strokeWidth="2.5px" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Reseñas Pendientes</span>
              <span className="stat-value">{stats.pendingReviews}</span>
            </div>
          </div>

          <div className="stat-card-review">
            <div className="stat-icon cancelled-icon">
              <CircleX strokeWidth="2.5px" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Pedidos Cancelados</span>
              <span className="stat-value">{stats.cancelledOrders}</span>
            </div>
          </div>

          <div className="stat-card-review">
            <div className="stat-icon average-icon">
              <ChartColumnBig strokeWidth="2.5px" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Calificación Promedio</span>
              <span className="stat-value">
                {stats.averageRating}{" "}
                <Star strokeWidth="2.5px" color="orange" fill="orange" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="reviews-content">
        {filteredReviews.length === 0 ? (
          <div className="no-reviews">
            <div className="no-reviews-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <h3>No hay reseñas disponibles</h3>
            <p>
              {searchTerm || filterRating !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Aún no hay reseñas de clientes"}
            </p>
          </div>
        ) : (
          <>
            {/* Grid de reseñas */}
            <div className="reviews-grid">
              {paginatedReviews.map((review, index) => (
                <div
                  key={review.id}
                  className="review-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="review-header">
                    <div className="review-user-info">
                      <div className="user-avatar-security">
                        {review.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="user-details">
                        <h4 className="user-name">
                          {review.name || "Usuario"}
                        </h4>
                        <p className="user-email">
                          {review.email || "Sin email"}
                        </p>
                      </div>
                    </div>
                    <div
                      className="review-rating-badge"
                      style={{ backgroundColor: getRatingColor(review.rating) }}
                    >
                      <span className="rating-number">{review.rating}</span>
                      <Star strokeWidth="2.5px" color="white" />
                    </div>
                  </div>

                  <div className="review-rating-label">
                    <span
                      className="rating-text"
                      style={{ color: getRatingColor(review.rating) }}
                    >
                      {getRatingLabel(review.rating)}
                    </span>
                    <div className="stars-display">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          strokeWidth="currentColor"
                          key={star}
                          fill={star <= review.rating ? "currentColor" : "none"}
                          style={{ color: getRatingColor(review.rating) }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="review-content">
                    <p className="review-comment">
                      {review.comment || "Sin comentario"}
                    </p>
                  </div>

                  <div className="review-footer">
                    <div className="review-date">
                      <Calendar1 strokeWidth="2.5px" />
                      {new Date(review.created_at).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <button
                      className="view-detail-btn"
                      onClick={() => handleViewDetail(review)}
                    >
                      Ver detalles
                      <ArrowBigRightDash strokeWidth="2.5px" />
                    </button>
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
      </div>

      {/* Modal de detalle */}
      {showDetailModal && selectedReview && (
        <div
          className="modal-overlay-reviews"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="modal-detail-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-detail-header"
              style={{
                backgroundColor: `${getRatingColor(selectedReview.rating)}20`,
                borderBottom: `2px solid ${getRatingColor(
                  selectedReview.rating
                )}`,
              }}
            >
              <h2
                style={{
                  color: getRatingColor(selectedReview.rating),
                }}
              >
                Detalle de la Reseña
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="modal-close"
                style={{
                  color: getRatingColor(selectedReview.rating),
                }}
              >
                <X strokeWidth="2.5px" />
              </button>
            </div>

            <div className="modal-detail-body">
              {/* Información del usuario */}
              <div className="detail-section">
                <h3 className="section-title">Información del Cliente</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Nombre:</span>
                    <span className="detail-value">{selectedReview.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedReview.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Teléfono:</span>
                    <span className="detail-value">
                      {selectedReview.phone_number || "No disponible"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">ID de Orden:</span>
                    <span className="detail-value">
                      #{selectedReview.order_id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Calificación */}
              <div className="detail-section">
                <h3 className="section-title">Calificación</h3>
                <div className="rating-detail">
                  <div
                    className="rating-badge-large"
                    style={{
                      backgroundColor: getRatingColor(selectedReview.rating),
                    }}
                  >
                    <span className="rating-number-large">
                      {selectedReview.rating}
                    </span>
                    <div className="stars-large">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          strokeWidth="currentColor"
                          key={star}
                          fill={
                            star <= selectedReview.rating ? "white" : "none"
                          }
                          color="white"
                        />
                      ))}
                    </div>
                    <span className="rating-label-large">
                      {getRatingLabel(selectedReview.rating)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comentario */}
              <div className="detail-section">
                <h3 className="section-title">Comentario</h3>
                <div className="comment-detail">
                  <p>{selectedReview.comment || "Sin comentario"}</p>
                </div>
              </div>

              {/* Fecha */}
              <div className="detail-section">
                <h3 className="section-title">Fecha de Publicación</h3>
                <div className="date-detail">
                  <Calendar strokeWidth="2.5px" />
                  {new Date(selectedReview.created_at).toLocaleDateString(
                    "es-CO",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withSessionGuard(withAdminGuard(AdminReviewsPage));
