import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Cafetera from "../components/Cafetera.jsx";
import withSessionGuard from "../hooks/withSessionGuard.jsx";
import { useMinimumLoadingTime } from "../hooks/useMinimumLoading.jsx";
import UserTrackingModal from "../components/UserTrackingModal.jsx";
import HeaderTitle from "../components/HeaderTitle.jsx";
import LoadingScreen from "../components/LoadingScreen";
import logger from "../utils/logger";
import { useModernAlert } from "../hooks/useModernAlert.jsx";
import {
  getHistorial,
  getShippingAddress,
  updateShippingAddress,
  createShippingAddress,
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  deleteProfileImage,
  updatePassword,
} from "../utils/api.js";
import {
  Phone,
  MapPin,
  SquarePen,
  MapPinHouse,
  LockKeyhole,
  X,
  Eye,
  EyeOff,
  Handbag,
  Box,
  CircleDollarSign,
  Calendar1,
  CircleCheckBig,
  ArrowBigLeft,
  ArrowBigRight,
  User,
  ImagePlus,
  Trash2,
  LogOut,
} from "lucide-react";
import "../styles/UserProfile.css";

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
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [addressForm, setAddressForm] = useState({
    line1: "",
    city: "",
    country: "CO",
    postal_code: "",
    state: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const showLoading = useMinimumLoadingTime(loading, 1000);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const { alert, confirm, success, error } = useModernAlert();
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
      import.meta.env.NODE_ENV === "production"
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

        const historyData = await getHistorial();
        setOrders(historyData.compras || []);
      } catch (err) {
        logger.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

      await success("¡Éxito!", "Perfil actualizado correctamente");
      window.location.reload();
    } catch (err) {
      error("Error", "No se pudo actualizar");
    }
  };

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

      await success(
        "¡Éxito!",
        shippingAddress
          ? "Dirección actualizada correctamente"
          : "Dirección creada correctamente"
      );

      window.location.reload();
    } catch (err) {
      error(
        "Error",
        shippingAddress
          ? "No se pudo actualizar la dirección"
          : "No se pudo crear la dirección"
      );
    }
  };

  // Manejo del cambio de contraseña
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!hasUpperCase) {
      return "La contraseña debe contener al menos una letra mayúscula";
    }
    if (!hasLowerCase) {
      return "La contraseña debe contener al menos una letra minúscula";
    }
    if (!hasNumber) {
      return "La contraseña debe contener al menos un número";
    }
    if (!hasSpecialChar) {
      return "La contraseña debe contener al menos un carácter especial";
    }
    return null;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return error("Error", "Las contraseñas nuevas no coinciden");
    }

    const passwordError = validatePassword(passwordForm.newPassword);
    if (passwordError) {
      return error("Contraseña inválida", passwordError);
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      return error(
        "Error",
        "La nueva contraseña debe ser diferente a la actual"
      );
    }

    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setIsChangingPassword(false);

      await success(
        "¡Contraseña actualizada!",
        "Tu contraseña ha sido cambiada exitosamente"
      );
    } catch (err) {
      error(
        "Error",
        err.response?.data?.message || "No se pudo actualizar la contraseña"
      );
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return error("Error", "Solo se permiten imágenes JPEG o PNG");
    }

    if (file.size > 5 * 1024 * 1024) {
      return error("Error", "La imagen debe ser menor a 5MB");
    }

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("profileImage", file);

      const response = await uploadProfileImage(formDataUpload);

      setProfile({
        ...profile,
        image: getImageUrl(response.image),
      });

      await success("¡Éxito!", "Imagen de perfil cargada correctamente");
      window.location.reload();
    } catch (err) {
      error("Error", "No se pudo cargar la imagen");
    }
  };

  const handleImageDelete = async () => {
    const result = await confirm(
      "¿Eliminar imagen de perfil?",
      "¿Estás seguro de que quieres eliminar tu imagen?"
    );

    if (result.isConfirmed) {
      try {
        await deleteProfileImage();
        setProfile({ ...profile, image: null });
        await success("Éxito", "Imagen eliminada");
        window.location.reload();
      } catch (err) {
        error("Error", "No se pudo eliminar la imagen");
      }
    }
  };

  const handleLogout = async () => {
    const result = await confirm(
      "¿Cerrar sesión?",
      "¿Estás seguro de que quieres cerrar tu sesión?"
    );

    if (result.isConfirmed) {
      logout();
      await success("✅ Sesión cerrada", "Has cerrado sesión exitosamente");
      window.location.href = "/";
    }
  };

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
    <div className="user-profile-container">
      <HeaderTitle
        title="Mi perfil"
        subtitle="Gestiona tu información personal y preferencias"
        backPath="/"
        backText="Volver al Inicio"
      />

      <div className="profile-content-wrapper">
        {/* Sección del perfil */}
        <section className="profile-card-modern">
          <div className="profile-header-section">
            <div className="profile-avatar-container">
              <div className="avatar-wrapper">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt="Perfil"
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder-modern">
                    <User strokeWidth="2px" />
                  </div>
                )}
                <div className="avatar-upload-overlay">
                  <label className="avatar-upload-label">
                    <ImagePlus strokeWidth="2.5px" />
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleImageChange}
                      className="avatar-input-hidden"
                    />
                  </label>
                </div>
              </div>
              {profile.image && (
                <button
                  onClick={handleImageDelete}
                  className="delete-avatar-btn"
                >
                  <Trash2 strokeWidth="2.5px" />
                  Eliminar foto
                </button>
              )}
            </div>

            <div className="profile-info-modern">
              <h2 className="profile-name">{profile.name || "Usuario"}</h2>
              <p className="profile-email">{profile.email}</p>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="detail-card-user">
              <div className="detail-icon">
                <Phone strokeWidth="2.5px" />
              </div>
              <div className="detail-content">
                <span className="detail-label">Teléfono</span>
                <span className="detail-value">
                  {profile.phone || "No registrado"}
                </span>
              </div>
            </div>

            <div className="detail-card-user">
              <div className="detail-icon">
                <MapPin strokeWidth="2.5px" />
              </div>
              <div className="detail-content">
                <span className="detail-label">Dirección</span>
                <span className="detail-value">{addressDisplay}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="action-btn primary"
            >
              <SquarePen strokeWidth="2.5px" />
              Editar perfil
            </button>
            <button
              onClick={() => setIsEditingAddress(true)}
              className="action-btn secondary"
            >
              <MapPinHouse strokeWidth="2.5px" />
              Editar dirección
            </button>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="action-btn secondary"
            >
              <LockKeyhole strokeWidth="2.5px" />
              Cambiar contraseña
            </button>
          </div>
        </section>

        {/* Modal de edición de perfil */}
        {isEditingProfile && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Editar perfil</h2>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="close-modal-btn"
                  aria-label="Cerrar modal"
                >
                  <X strokeWidth="2.5px" />
                </button>
              </div>
              <form onSubmit={handleProfileSubmit} className="modal-form">
                <div className="form-field">
                  <label className="form-label">Nombre completo</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    type="email"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Teléfono</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn-submit">
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de edición de dirección */}
        {isEditingAddress && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>
                  {shippingAddress ? "Editar dirección" : "Agregar dirección"}
                </h2>
                <button
                  onClick={() => setIsEditingAddress(false)}
                  className="close-modal-btn"
                >
                  <X strokeWidth="2.5px" />
                </button>
              </div>
              <form onSubmit={handleAddressSubmit} className="modal-form">
                <div className="form-field">
                  <label className="form-label">Dirección completa</label>
                  <input
                    name="line1"
                    value={addressForm.line1}
                    onChange={handleAddressChange}
                    className="form-input"
                    placeholder="Calle, número, apartamento"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Ciudad</label>
                    <input
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Código Postal</label>
                    <input
                      name="postal_code"
                      value={addressForm.postal_code}
                      onChange={handleAddressChange}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Departamento/Estado</label>
                    <input
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">País</label>
                    <input
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn-submit">
                    Guardar dirección
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de cambio de contraseña */}
        {isChangingPassword && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Cambiar contraseña</h2>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="close-modal-btn"
                >
                  <X strokeWidth="2.5px" />
                </button>
              </div>
              <form onSubmit={handlePasswordSubmit} className="modal-form">
                <div className="password-requirements">
                  <p className="requirements-title">
                    La contraseña debe contener:
                  </p>
                  <ul className="requirements-list">
                    <li>Al menos 8 caracteres</li>
                    <li>Una letra mayúscula y una minúscula</li>
                    <li>Un número</li>
                    <li>Un carácter especial (!@#$%^&*)</li>
                  </ul>
                </div>

                <div className="form-field">
                  <label className="form-label">Contraseña actual</label>
                  <div className="password-input-wrapper">
                    <input
                      name="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="password-toggle"
                    >
                      {showPasswords.current ? (
                        <Eye strokeWidth="2.5px" />
                      ) : (
                        <EyeOff strokeWidth="2.5px" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Nueva contraseña</label>
                  <div className="password-input-wrapper">
                    <input
                      name="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="password-toggle"
                    >
                      {showPasswords.new ? (
                        <Eye strokeWidth="2.5px" />
                      ) : (
                        <EyeOff strokeWidth="2.5px" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">
                    Confirmar nueva contraseña
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      name="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="password-toggle"
                    >
                      {showPasswords.confirm ? (
                        <Eye strokeWidth="2.5px" />
                      ) : (
                        <EyeOff strokeWidth="2.5px" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn-submit">
                    Actualizar contraseña
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sección de historial de compras */}
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
                    <Handbag strokeWidth="2.5px" />
                    <span>
                      {orders.length}{" "}
                      {orders.length === 1 ? "Compra" : "Compras"}
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
                            <Calendar1 strokeWidth="2.5px" />
                            Fecha
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
                              {new Date(order.fecha).toLocaleDateString(
                                "es-CO",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
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
                            <Box strokeWidth="2.5px" />
                            Producto
                          </div>
                          <div className="order-card-value">
                            {order.producto}
                          </div>
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
                        {order.shipping_address && (
                          <div className="order-card-row">
                            <div className="order-card-label">
                              <MapPin strokeWidth="2.5px" />
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
          <button onClick={handleLogout} className="logout-button-modern">
            <LogOut strokeWidth="3px" size={20} />
            Cerrar sesión
          </button>
        </section>
      </div>

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
      {alert}
    </div>
  );
};

export default withSessionGuard(UserProfilePage);
