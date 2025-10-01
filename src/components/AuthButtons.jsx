import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import AuthModal from "./AuthModal.jsx";
import Swal from "sweetalert2";

const AuthButtons = () => {
  const { user, logout } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se cerrará tu sesión actual",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#8B4513",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "Has cerrado sesión exitosamente",
          timer: 1000,
          showConfirmButton: false,
        });
      }
    });
  };

  if (!user) {
    return (
      <>
        <button id="show-form-button" onClick={() => setModalOpen(true)}>
          Iniciar sesión
        </button>
        <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <div id="user-profile" className="auth-visible">
      <span id="user-name">{user.name}</span>
      <span id="logout-initial">{user.name.charAt(0).toUpperCase()}</span>
      <button id="logout-btn" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default AuthButtons;
