import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Cafetera from "../components/Cafetera.jsx";
import withSessionGuard from "../hocs/withSessionGuard";
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
  const pageSize = 10;

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
    ? `${shippingAddress.line1}, ${shippingAddress.city}, ${
        shippingAddress.country
      }${
        shippingAddress.postal_code ? `, ${shippingAddress.postal_code}` : ""
      }${shippingAddress.state ? `, ${shippingAddress.state}` : ""}`
    : "Sin dirección";

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h2>Mi Perfil</h2>
      </header>

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

      <section className="orders-section">
        <h2>Historial de Compras</h2>
        {orders.length === 0 ? (
          <div className="text_no_orders">
            <Cafetera />
            <p>No hay compras registradas.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Fecha</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.producto}</td>
                    <td>${Number(order.precio).toFixed(2)}</td>
                    <td>{new Date(order.fecha).toLocaleDateString("es-CO")}</td>
                    <td>
                      {order.shipping_address
                        ? `${order.shipping_address.line1}, ${order.shipping_address.city}`
                        : "N/A"}
                    </td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="pagination-btns">
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
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </section>
    </div>
  );
};

export default withSessionGuard(UserProfilePage);
