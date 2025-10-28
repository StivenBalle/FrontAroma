import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cafetera from "../components/Cafetera.jsx";
import withAdminGuard from "../hocs/withAdminGuard.jsx";
import LoadingScreen from "../components/LoadingScreen";
import { getAdminOrders, getUsers } from "../api.js";
import Swal from "sweetalert2";
import "../App.css";

const OrdersPageInner = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const [ordersData, usersData] = await Promise.all([
        getAdminOrders(),
        getUsers(""),
      ]);

      setOrders(ordersData.orders || []);
      setFilteredOrders(ordersData.orders || []);
      setUsers(usersData.users || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ Error en fetchOrders:", err);
      // Manejo específico de errores de autenticación/acceso
      if (err.status === 401 || err.status === 403) {
        console.log("Error de acceso detectado; manejado por HOC");
      } else {
        Swal.fire("Error", "No se pudieron cargar las órdenes", "error");
      }
    } finally {
      setPageLoading(false);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchLoading(true);
    const filtered = orders.filter((order) =>
      order.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log("Órdenes filtradas:", filtered);
    setFilteredOrders(filtered);
    setCurrentPage(1);
    setTimeout(() => setSearchLoading(false), 500);
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="admin-orders-page">
      {/* Header con botón de volver */}
      <div className="admin-page-header">
        <div className="header-left">
          <h2 className="admin-page-title">Gestión de Compras</h2>
          <p className="admin-page-subtitle">
            Busca y administra todas las órdenes de tus clientes
          </p>
        </div>
        <button onClick={() => navigate("/admin")} className="back-btn-modern">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al Dashboard
        </button>
      </div>

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
          <button type="submit" className="search-btn-modern">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Buscar
          </button>
        </form>

        {/* Estadísticas rápidas */}
        {filteredOrders.length > 0 && (
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon orders-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Órdenes</span>
                <span className="stat-value">{filteredOrders.length}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon revenue-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
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
                      ID
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Usuario
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      Producto
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Precio
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Teléfono
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Dirección
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Estado
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
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
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
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
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                              </svg>
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
                        <span className={`status-badge status-${order.status}`}>
                          {order.status}
                        </span>
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
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
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
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        Producto
                      </div>
                      <div className="order-card-value">{order.producto}</div>
                    </div>

                    <div className="order-card-row">
                      <div className="order-card-label">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Precio
                      </div>
                      <div className="order-card-value price-cell">
                        ${Number(order.precio).toFixed(2)}
                      </div>
                    </div>

                    {order.phone && (
                      <div className="order-card-row">
                        <div className="order-card-label">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          Teléfono
                        </div>
                        <div className="order-card-value">{order.phone}</div>
                      </div>
                    )}

                    {order.shipping_address && (
                      <div className="order-card-row">
                        <div className="order-card-label">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
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
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default withAdminGuard(OrdersPageInner);
