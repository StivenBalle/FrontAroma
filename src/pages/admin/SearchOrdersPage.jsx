import React, { useEffect, useState } from "react";
import Cafetera from "../../components/Cafetera.jsx";
import withAdminGuard from "../../hooks/withAdminGuard.jsx";
import { useMinimumLoadingTime } from "../../hooks/useMinimumLoading.jsx";
import UserTrackingModal from "../../components/UserTrackingModal.jsx";
import HeaderTitle from "../../components/HeaderTitle.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import usePermissions from "../../hooks/usePermissions.jsx";
import {
  getAdminOrders,
  getUsers,
  updateOrderStatus,
} from "../../utils/api.js";
import logger from "../../utils/logger.js";
import { useModernAlert } from "../../hooks/useModernAlert.jsx";
import "../../App.css";
import {
  ArrowBigLeft,
  ArrowBigRight,
  Box,
  Calendar1,
  CircleCheckBig,
  CircleDollarSign,
  Handbag,
  Hash,
  MapPin,
  Phone,
  Search,
  User,
  Lock,
} from "lucide-react";

const OrdersPageInner = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const showLoading = useMinimumLoadingTime(loading, 1000);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const permissions = usePermissions();
  const { alert, error } = useModernAlert();
  const pageSize = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [ordersData, usersData] = await Promise.all([
        getAdminOrders(),
        getUsers(""),
      ]);

      setOrders(ordersData.orders || []);
      setFilteredOrders(ordersData.orders || []);
      setUsers(usersData.users || []);
      setCurrentPage(1);
    } catch (err) {
      logger.error("❌ Error en fetchOrders:", err);
      // Manejo específico de errores de autenticación/acceso
      if (err.status === 401 || err.status === 403) {
        logger.log("Error de acceso detectado; manejado por HOC");
      } else {
        error("Error", "No se pudieron cargar las órdenes");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchLoading(true);
    const filtered = orders.filter((order) =>
      order.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    logger.log("Órdenes filtradas:", filtered);
    setFilteredOrders(filtered);
    setCurrentPage(1);
    setTimeout(() => setSearchLoading(false), 1000);
  };

  const handleViewTracking = (order) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch (error) {
      logger.error("Error al actualizar estado:", error);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredOrders(orders);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (showLoading) {
    return <LoadingScreen title="Cargando compras..." />;
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
        title="Gestión de compras"
        subtitle="Busca y administra todas las órdenes de tus clientes"
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
              placeholder="Buscar por correo..."
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
            disabled={searchLoading}
          >
            <Search className={searchLoading ? "spinning" : ""} size={20} />
            <span>Buscar</span>
          </button>
        </form>

        {/* Estadísticas rápidas */}
        {filteredOrders.length > 0 && (
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon orders-icon">
                <Handbag strokeWidth="2.5px" />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Órdenes</span>
                <span className="stat-value">{filteredOrders.length}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon revenue-icon">
                <CircleDollarSign strokeWidth="2.5px" />
              </div>
              <div className="stat-content">
                <span className="stat-label">Ingresos Total</span>
                <span className="stat-value">
                  $
                  {filteredOrders
                    .reduce((sum, order) => sum + Number(order.precio), 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      {searchLoading ? (
        <div className="loading-products">
          <div className="loading-content">
            <div className="spinner"></div>
            <h3>Buscando órdenes...</h3>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="no-orders-modern">
          <div className="no-orders-content">
            <Cafetera />
            <h3>No se encontraron órdenes</h3>
            <p>
              {searchTerm
                ? "Intenta con otro correo electrónico"
                : "No hay órdenes registradas en el sistema"}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Vista de tabla para desktop */}
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
                      <User strokeWidth="2.5px" />
                      Usuario
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <Box strokeWidth="2.5px" />
                      Producto
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <CircleDollarSign strokeWidth="2.5px" />
                      Precio
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <Phone strokeWidth="2.5px" />
                      Teléfono
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <MapPin strokeWidth="2.5px" />
                      Dirección
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <CircleCheckBig strokeWidth="2.5px" />
                      Estado
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <Calendar1 strokeWidth="2.5px" />
                      Fecha
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order, index) => {
                  const user = users.find((u) => u.email === order.user_email);
                  const userImage = user?.image || null;
                  return (
                    <tr
                      key={order.id}
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <td>
                        <span className="order-id-badge">#{order.id}</span>
                      </td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-large">
                            {user.image ? (
                              <img
                                src={userImage}
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
                          <div className="user-info">
                            <span className="user-name">{order.user_name}</span>
                            <span className="user-email">
                              {order.user_email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="product-name">{order.producto}</span>
                      </td>
                      <td>
                        <span className="price-cell">
                          ${Number(order.precio).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <div className="phone-cell">
                          {order.phone ? (
                            <>
                              <Phone strokeWidth="2.5px" />
                              <span>{order.phone}</span>
                            </>
                          ) : (
                            <span className="na-text">N/A</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="address-cell">
                          {order.shipping_address ? (
                            <>
                              <MapPin strokeWidth="2.5px" />
                              <div className="address-text">
                                <span>{order.shipping_address.line1}</span>
                                <span className="address-city">
                                  {order.shipping_address.city},{" "}
                                  {order.shipping_address.country}
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="na-text">N/A</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleViewTracking(order)}
                          className="track-order-btn admin-track-btn"
                        >
                          Gestionar estado
                        </button>
                      </td>
                      <td>
                        <span className="date-cell">
                          {new Date(order.fecha).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Vista de cards para móvil */}
          <div className="orders-cards-mobile">
            {paginatedOrders.map((order, index) => {
              const user = users.find((u) => u.email === order.user_email);
              const userImage = user?.image || null;
              return (
                <div
                  key={order.id}
                  className="admin-order-card-mobile"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="order-card-header">
                    <span className="order-id-badge">#{order.id}</span>
                    <button
                      onClick={() => handleViewTracking(order)}
                      className="track-order-btn-mobile admin-track-btn"
                    >
                      Ver Pedido
                    </button>
                  </div>
                  <div className="order-card-body">
                    <div className="order-card-section">
                      <div className="section-title">Cliente</div>
                      <div className="user-cell-mobile">
                        <div className="user-avatar-large">
                          {user.image ? (
                            <img
                              src={userImage}
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
                        <div className="user-info-mobile">
                          <span className="user-name">{order.user_name}</span>
                          <span className="user-email">{order.user_email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="order-card-row">
                      <div className="order-card-label">
                        <Box strokeWidth="2.5px" />
                        Producto
                      </div>
                      <div className="order-card-value">{order.producto}</div>
                    </div>

                    <div className="order-card-row">
                      <div className="order-card-label">
                        <CircleDollarSign strokeWidth="2.5px" />
                        Precio
                      </div>
                      <div className="order-card-value price-cell">
                        ${Number(order.precio).toFixed(2)}
                      </div>
                    </div>

                    {order.phone && (
                      <div className="order-card-row">
                        <div className="order-card-label">
                          <Phone strokeWidth="2.5px" />
                          Teléfono
                        </div>
                        <div className="order-card-value">{order.phone}</div>
                      </div>
                    )}

                    {order.shipping_address && (
                      <div className="order-card-row">
                        <div className="order-card-label">
                          <MapPin strokeWidth="2.5px" />
                          Dirección
                        </div>
                        <div className="order-card-value">
                          {order.shipping_address.line1},{" "}
                          {order.shipping_address.city},{" "}
                          {order.shipping_address.country}
                        </div>
                      </div>
                    )}

                    <div className="order-card-row">
                      <div className="order-card-label">
                        <Calendar1 strokeWidth="2.5px" />
                        Fecha
                      </div>
                      <div className="order-card-value">
                        {new Date(order.fecha).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
      {showTrackingModal && selectedOrder && (
        <UserTrackingModal
          order={selectedOrder}
          onClose={() => {
            setShowTrackingModal(false);
            setSelectedOrder(null);
          }}
          isAdmin={true}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
      {alert}
    </div>
  );
};

export default withAdminGuard(OrdersPageInner);
