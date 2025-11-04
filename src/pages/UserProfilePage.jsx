import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Cafetera from "../components/Cafetera.jsx";
import withSessionGuard from "../hooks/withSessionGuard.jsx";
import { useMinimumLoadingTime } from "../hooks/useMinimumLoading.jsx";
import UserTrackingModal from "../components/UserTrackingModal.jsx";
import HeaderTitle from "../components/HeaderTitle.jsx";
import LoadingScreen from "../components/LoadingScreen";
import Swal from "sweetalert2";
import {
  getHistorial,
  getShippingAddress,
  updateShippingAddress,
  createShippingAddress,
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  deleteProfileImage,
} from "../api.js";
import "../App.css";

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
  });
  const [shippingAddress, setShippingAddress] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [addressForm, setAddressForm] = useState({
    line1: "",
    city: "",
    country: "CO",
    postal_code: "",
    state: "",
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const showLoading = useMinimumLoadingTime(loading, 1000);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const pageSize = 10;

  const handleViewTracking = (order) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
  };

  // Helper to get image URL
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    const baseUrl =
      import.meta.env.MODE === "production"
        ? "https://backendaromaserrania.onrender.com"
        : "http://localhost:3000";
    return `${baseUrl}${image}`;
  };

  // Fetch data on mount
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch profile
        const profileData = await getUserProfile();
        setProfile({
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone_number || "",
          image: getImageUrl(profileData.image),
        });
        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone_number || "",
        });

        // Fetch address
        const addressData = await getShippingAddress();
        setShippingAddress(addressData.address || null);
        setAddressForm(
          addressData.address || {
            line1: "",
            city: "",
            country: "CO",
            postal_code: "",
            state: "",
          }
        );

        // Fetch orders
        const historyData = await getHistorial();
        setOrders(historyData.compras || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        Swal.fire("Error", "No se pudo cargar los datos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle profile edit
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateUserProfile(formData);
      setProfile({
        ...profile,
        name: updated.name,
        email: updated.email,
        phone: updated.phone_number,
      });
      setIsEditingProfile(false);
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Perfil actualizado correctamente",
        timer: 1500,
        showConfirmButton: true,
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };

  // Handle address edit
  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiCall = shippingAddress
        ? updateShippingAddress
        : createShippingAddress;
      const response = await apiCall(addressForm);
      setShippingAddress(response.address);
      setIsEditingAddress(false);
      const updatedAddress = await getShippingAddress();
      setShippingAddress(updatedAddress.address || null);
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: shippingAddress
          ? "Dirección actualizada correctamente"
          : "Dirección creada correctamente",
        timer: 1500,
        showConfirmButton: true,
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      console.error("❌ Error saving address:", err.message);
      Swal.fire(
        "Error",
        shippingAddress
          ? "No se pudo actualizar la dirección"
          : "No se pudo crear la dirección",
        "error"
      );
    }
  };

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return Swal.fire("Error", "Solo JPEG o PNG", "error");
    }
    if (file.size > 5 * 1024 * 1024) {
      return Swal.fire("Error", "Imagen menor a 5MB", "error");
    }
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("profileImage", file);
      const response = await uploadProfileImage(formDataUpload);
      setProfile({ ...profile, image: getImageUrl(response.image) });
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Imagen de perfil cargada correctamente",
        timer: 1500,
        showConfirmButton: true,
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      Swal.fire("Error", "No se pudo cargar la imagen", "error");
    }
  };

  // Handle image delete
  const handleImageDelete = () => {
    Swal.fire({
      icon: "warning",
      title: "¿Eliminar imagen de perfil?",
      text: "¿Estás seguro de que quieres eliminar tu imagen de perfil?",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4a2c2a",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProfileImage();
          setProfile({ ...profile, image: null });
          Swal.fire("Éxito", "Imagen eliminada", "success").then(() => {
            window.location.reload();
          });
        } catch (err) {
          Swal.fire("Error", "No se pudo eliminar", "error");
        }
      }
    });
  };

  // Handle logout
  const handleLogout = () => {
    Swal.fire({
      icon: "question",
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que quieres cerrar tu sesión?",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4a2c2a",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire(
          "✅ Sesión cerrada",
          "Has cerrado sesión exitosamente",
          "success"
        ).then(() => {
          window.location.href = "/";
        });
      }
    });
  };

  // Pagination
  const totalPages = Math.ceil(orders.length / pageSize);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (showLoading) {
    return <LoadingScreen title="Preparando tu perfil..." />;
  }

  const addressDisplay = shippingAddress
    ? `${shippingAddress.line1}, ${shippingAddress.city}, ${
        shippingAddress.country
      }${
        shippingAddress.postal_code ? `, ${shippingAddress.postal_code}` : ""
      }${shippingAddress.state ? `, ${shippingAddress.state}` : ""}`
    : "Sin dirección";

  return (
    <div className="admin-orders-page">
      <HeaderTitle
        title="Mi perfil"
        subtitle="Actualiza tus datos personales"
        backPath="/"
        backText="Volver al Inicio"
      />

      <section className="profile-section">
        <div className="profile-avatar">
          {profile.image ? (
            <img src={profile.image} alt="Perfil" className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">
              {profile.name.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div className="avatar-actions">
            <label className="upload-button">
              Subir Imagen
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                hidden
              />
            </label>
            {profile.image && (
              <button onClick={handleImageDelete} className="delete-button">
                Eliminar
              </button>
            )}
          </div>
        </div>

        <div className="profile-info">
          <h2>Información Personal</h2>
          <p>
            <strong>Nombre:</strong> {profile.name || "Sin nombre"}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {profile.phone || "Sin teléfono"}
          </p>
          <p>
            <strong>Dirección:</strong> {addressDisplay}
          </p>
          <div className="edit-buttons">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="edit-button"
            >
              Editar Perfil
            </button>
            <button
              onClick={() => setIsEditingAddress(true)}
              className="edit-button"
            >
              Editar Dirección
            </button>
          </div>
        </div>
      </section>

      {isEditingProfile && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Perfil</h2>
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  type="email"
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-button">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="cancel-button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditingAddress && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {shippingAddress ? "Editar Dirección" : "Agregar Dirección"}
            </h2>
            <form onSubmit={handleAddressSubmit}>
              <div className="form-group">
                <label>Calle</label>
                <input
                  name="line1"
                  value={addressForm.line1}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ciudad</label>
                <input
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Código Postal</label>
                <input
                  name="postal_code"
                  value={addressForm.postal_code}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <input
                  name="state"
                  value={addressForm.state}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-group">
                <label>País</label>
                <input
                  name="country"
                  value={addressForm.country}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-button">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="cancel-button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="orders-section-modern">
        <div className="orders-container">
          <div className="orders-header">
            <div className="orders-header-content">
              <h2 className="orders-title">Historial de Compras</h2>
              <p className="orders-subtitle">
                Revisa todas tus órdenes y su estado actual
              </p>
            </div>
            {orders.length > 0 && (
              <div className="orders-stats">
                <div className="stat-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>
                    {orders.length} {orders.length === 1 ? "Compra" : "Compras"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="no-orders-modern">
              <div className="no-orders-content">
                <Cafetera />
                <h3>No hay compras registradas</h3>
                <p>Cuando realices tu primera compra, aparecerá aquí</p>
              </div>
            </div>
          ) : (
            <>
              {/* Vista de tabla para desktop */}
              <div className="table-wrapper-modern">
                <table className="orders-table-modern">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Fecha
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
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td>
                          <span className="order-id-badge">#{order.id}</span>
                        </td>
                        <td>
                          <div className="product-cell">
                            <span className="product-name">
                              {order.producto}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="price-cell">
                            ${Number(order.precio).toFixed(2)}
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
                                <span>
                                  {order.shipping_address.line1},{" "}
                                  {order.shipping_address.city}
                                </span>
                              </>
                            ) : (
                              <span className="na-text">N/A</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => handleViewTracking(order)}
                            className="track-order-btn"
                          >
                            Ver seguimiento
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista de cards para móvil */}
              <div className="orders-cards-mobile">
                {paginatedOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className="order-card-mobile"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="order-card-header">
                      <span className="order-id-badge">#{order.id}</span>
                      <button
                        onClick={() => handleViewTracking(order)}
                        className="track-order-btn-mobile"
                      >
                        Ver estado
                      </button>
                    </div>
                    <div className="order-card-body">
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
                            {order.shipping_address.city}
                          </div>
                        </div>
                      )}
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
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </section>
      {showTrackingModal && selectedOrder && (
        <UserTrackingModal
          order={selectedOrder}
          onClose={() => {
            setShowTrackingModal(false);
            setSelectedOrder(null);
          }}
          isAdmin={false}
        />
      )}
    </div>
  );
};

export default withSessionGuard(UserProfilePage);
