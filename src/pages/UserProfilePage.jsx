import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Cafetera from "../components/Cafetera.jsx";
import withSessionGuard from "../hooks/withSessionGuard.jsx";
import { useMinimumLoadingTime } from "../hooks/useMinimumLoading.jsx";
import UserTrackingModal from "../components/UserTrackingModal.jsx";
import HeaderTitle from "../components/HeaderTitle.jsx";
import LoadingScreen from "../components/LoadingScreen";
import logger from "../utils/logger";
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
  updatePassword,
} from "../utils/api.js";
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
      logger.error("❌ Error saving address:", err.message);
      Swal.fire(
        "Error",
        shippingAddress
          ? "No se pudo actualizar la dirección"
          : "No se pudo crear la dirección",
        "error"
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

    // Validaciones
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas nuevas no coinciden",
      });
    }

    const passwordError = validatePassword(passwordForm.newPassword);
    if (passwordError) {
      return Swal.fire({
        icon: "error",
        title: "Contraseña inválida",
        text: passwordError,
      });
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "La nueva contraseña debe ser diferente a la actual",
      });
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

      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Tu contraseña ha sido cambiada exitosamente",
        timer: 2000,
        showConfirmButton: true,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message || "No se pudo actualizar la contraseña",
      });
    }
  };

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
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
                <div className="avatar-upload-overlay">
                  <label className="avatar-upload-label">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2z" />
                    </svg>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar perfil
            </button>
            <button
              onClick={() => setIsEditingAddress(true)}
              className="action-btn secondary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              Editar dirección
            </button>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="action-btn secondary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
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
                  className="modal-close"
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
                  className="modal-close"
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
                  className="modal-close"
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
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
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
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
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
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
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
                          <div className="order-card-value">
                            {order.producto}
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

                {totalPages > 1 && (
                  <div className="pagination-modern">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className="pagination-btn-modern"
                      aria-label="Página anterior"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
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
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
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
          <button onClick={handleLogout} className="logout-button-modern">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
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
    </div>
  );
};

export default withSessionGuard(UserProfilePage);
