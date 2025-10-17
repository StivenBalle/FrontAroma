import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Cafetera from "../components/Cafetera.jsx";
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
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    created_at: "",
    image: "",
  });
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [addressForm, setAddressForm] = useState({
    line1: "",
    city: "",
    country: "CO",
    postal_code: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const pageSize = 15;

  const getImageUrl = (image) => {
    if (!image || image.trim() === "") {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    const baseUrl =
      import.meta.env.MODE === "production"
        ? "https://backendaromaserrania.onrender.com"
        : "http://localhost:3000";

    return `${baseUrl}${image}`;
  };

  // Cargar datos del perfil
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile();
        const dateCreated = data.created_at.split("T")[0];
        setProfile({
          name: data.name || user.name || "",
          email: data.email || user.email || "",
          phone: data.phone_number || "",
          role: data.role || "",
          created_at: dateCreated || "",
          image: getImageUrl(user.image),
        });
        setFormData({
          name: data.name || "",
          phone: data.phone_number || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("❌ Error fetching profile:", err.message);
        Swal.fire("Error", "No se pudo cargar el perfil", "error");
      } finally {
        setLoading(false);
      }
    };

    const fetchShippingAddress = async () => {
      try {
        const data = await getShippingAddress();
        setShippingAddress(data.address || null);
      } catch (err) {
        console.error("❌ Error fetching address:", err.message);
        setShippingAddress(null);
        Swal.fire("Error", "No se pudo cargar la dirección", "error");
      }
    };

    const fetchHistory = async () => {
      try {
        const data = await getHistorial();
        console.log("Historial cargado:", JSON.stringify(data, null, 2));
        setFilteredOrders(data.compras || []);
        setCurrentPage(1);
      } catch (err) {
        console.error("❌ Error fetching history:", err.message);
        Swal.fire(
          "Error",
          "No se pudo cargar el historial de compras",
          "error"
        );
      }
    };

    Promise.all([
      fetchProfile(),
      fetchShippingAddress(),
      fetchHistory(),
    ]).finally(() => {
      setLoading(false);
    });
  }, [user]);

  // Manejar cambios en el formulario de perfil
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar cambios en el formulario de dirección
  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  // Manejar carga de imagen
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log("📁 Archivo seleccionado:", file);
    if (!file) {
      console.error("❌ No se seleccionó ningún archivo");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire("Error", "Solo se permiten imágenes JPEG o PNG", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "La imagen no debe exceder los 5MB", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      console.log("📤 Enviando FormData con archivo:", file.name);
      for (let [key, value] of formData.entries()) {
        console.log(`📤 FormData entry: ${key}=${value.name || value}`);
      }
      const response = await uploadProfileImage(formData);
      console.log("📤 Imagen de perfil cargada:", response);
      const newImageUrl = getImageUrl(response.image);
      setProfile({ ...profile, image: newImageUrl });
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
      console.error("❌ Error uploading image:", err.message);
      Swal.fire("Error", "No se pudo cargar la imagen", "error");
    }
  };

  // Manejar eliminación de imagen
  const handleImageDelete = async () => {
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
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: "Imagen de perfil eliminada correctamente",
            timer: 1500,
            showConfirmButton: true,
          }).then(() => {
            window.location.reload();
          });
        } catch (err) {
          console.error("❌ Error deleting image:", err.message);
          Swal.fire(
            "Error",
            `No se pudo eliminar la imagen: ${err.message}`,
            "error"
          );
        }
      }
    });
  };

  // Actualizar perfil
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updateUserProfile(formData);
      setProfile({
        ...profile,
        name: data.name,
        phone: data.phone_number,
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
      console.error("❌ Error updating profile:", err.message);
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  // Crear o actualizar dirección
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

  // Manejar cierre de sesión
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
    return (
      <div className="loading-products">
        <div className="loading-content">
          <div className="spinner"></div>
          <h3>Cargando perfil...</h3>
        </div>
      </div>
    );
  }

  const addressDisplay = shippingAddress
    ? `${shippingAddress.line1 || ""}, ${shippingAddress.city || ""}, ${
        shippingAddress.country || ""
      }${
        shippingAddress.postal_code ? `, ${shippingAddress.postal_code}` : ""
      }${shippingAddress.state ? `, ${shippingAddress.state}` : ""}`
    : "Sin dirección";

  return (
    <div className="profile-container">
      <h2 className="profile-title">Perfil de Usuario</h2>
      <button onClick={handleLogout} className="logout-btn">
        <div className="sign-logout-btn">
          <svg viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
          </svg>
        </div>
        <div className="text-logout">Cerrar Sesión</div>
      </button>

      <div className="profile-settings-card">
        <h2 className="profile-settings-title">Información del perfil</h2>
        <div className="profile-settings-content">
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="Profile"
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {profile.name ? profile.name[0].toUpperCase() : "?"}
                </div>
              )}
              <label htmlFor="profile-image-upload" className="avatar-change">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 7a.5.5 0 0 1 .5.5v1a2.5 2.5 0 1 1-2.5-2.5h1a.5.5 0 0 1 0 1h-1A1.5 1.5 0 1 0 11 8.5v-1a.5.5 0 0 1 .5-.5z" />
                  <path d="M4.406 11.742A5.5 5.5 0 0 1 8 3a5.5 5.5 0 0 1 3.594 8.742l.453.742H12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2h.953l.453-.742zM8 4a4.5 4.5 0 0 0-3.536 7.273L4.58 12H11.42l.116-.727A4.5 4.5 0 0 0 8 4z" />
                </svg>
                <span>Subir imagen</span>
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              {profile.image && (
                <button
                  onClick={handleImageDelete}
                  className="delete-photo-btn"
                >
                  Eliminar Foto
                </button>
              )}
            </div>
          </div>
          <div className="profile-info-section">
            <div className="info-row">
              <span className="info-label">Nombre</span>
              <span className="info-value">{profile.name || "Sin nombre"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{profile.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Teléfono</span>
              <span className="info-value">
                {profile.phone || "Sin teléfono"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Dirección de envío</span>
              <span className="info-value">{addressDisplay}</span>
            </div>
            <div className="profile-buttons">
              <button
                className="edit-address-btn"
                onClick={() => setIsEditingAddress(true)}
              >
                Editar Dirección
              </button>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="edit-profile-btn"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición del perfil */}
      {isEditingProfile && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar perfil</h3>
            <form onSubmit={handleProfileSubmit} className="modal-form">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  Guardar
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Historial de compras */}
      <div className="history-card">
        <h2 className="section-title">Historial de Compras</h2>
        {paginatedOrders.length === 0 ? (
          <div className="text_no_orders">
            <Cafetera />
            <p>No hay órdenes registradas.</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Fecha</th>
                <th>Dirección</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((compra) => (
                <tr key={compra.id}>
                  <td>{compra.id}</td>
                  <td>{compra.producto}</td>
                  <td>${Number(compra.precio).toFixed(2)}</td>
                  <td>{new Date(compra.fecha).toLocaleDateString("es-CO")}</td>
                  <td>
                    {compra.shipping_address ? (
                      <div>
                        <p>{compra.shipping_address.line1}</p>
                        <p>
                          {compra.shipping_address.city},{" "}
                          {compra.shipping_address.country}
                        </p>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <span className={`status ${compra.status}`}>
                      {compra.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Modal para editar dirección */}
      {isEditingAddress && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              {shippingAddress ? "Editar Dirección" : "Agregar Dirección"}
            </h2>
            <form onSubmit={handleAddressSubmit}>
              <div className="form-group">
                <label>Calle</label>
                <input
                  type="text"
                  name="line1"
                  value={addressForm.line1}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ciudad</label>
                <input
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Código Postal</label>
                <input
                  type="text"
                  name="postal_code"
                  value={addressForm.postal_code}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-group">
                <label>Estado/Departamento</label>
                <input
                  type="text"
                  name="state"
                  value={addressForm.state}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-group">
                <label>País</label>
                <input
                  type="text"
                  name="country"
                  value={addressForm.country}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
