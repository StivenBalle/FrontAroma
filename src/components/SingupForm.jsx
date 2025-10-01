import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import logoCafe from "../assets/LogoCafe.png";
import Swal from "sweetalert2";
import { register } from "../api.js";
import "../styles/header.css";

const SignupForm = ({ switchToLogin }) => {
  const { closeAuthModal } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo no es válido";
    }
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "El teléfono es obligatorio";
    } else if (!/^\d{7,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = "El teléfono debe tener entre 7 y 15 dígitos";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Limpiar errores al escribir
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario en el cliente
    if (!validateForm()) {
      Swal.fire(
        "❌ Error",
        "Por favor corrige los errores en el formulario",
        "error"
      );
      return;
    }

    try {
      const data = await register(
        formData.name,
        formData.phone_number,
        formData.email,
        formData.password
      );

      console.log("Respuesta de la API:", data); // 🔹 Depuración

      if (data.message === "✅ Registro exitoso") {
        await Swal.fire({
          icon: "success",
          title: "✅ Registro exitoso",
          text: "Usuario creado",
          timer: 1500,
          showConfirmButton: false,
        });
        switchToLogin();
        closeAuthModal();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "❌ Error",
          text:
            data.error ||
            data.message ||
            "No se pudo registrar. Por favor intenta de nuevo.",
        });
      }
    } catch (err) {
      console.error("❌ Error en registro:", err);
      let errorMessage = "Error desconocido. Por favor intenta de nuevo.";
      if (err.message.includes("409")) {
        errorMessage = "El correo ya está registrado";
      } else if (err.message.includes("400")) {
        errorMessage = "Datos inválidos. Verifica los campos";
      } else if (err.message.includes("Network Error")) {
        errorMessage = "Servidor no disponible. Intenta de nuevo más tarde";
      }
      Swal.fire({
        icon: "error",
        title: "❌ Error",
        text: errorMessage,
      });
    }
  };

  return (
    <form className="form" id="signupForm" onSubmit={handleSubmit}>
      <button type="button" className="button_close" onClick={closeAuthModal}>
        <span className="X"></span>
        <span className="Y"></span>
        <div className="close">Cerrar</div>
      </button>

      <img src={logoCafe} alt="Logo Café" />

      {/* Nombre */}
      <div className="flex-column">
        <label>Nombre</label>
      </div>
      <div className="inputForm">
        <svg
          height="60"
          viewBox="0 -9 32 32"
          width="40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Layer_3" data-name="Layer 3">
            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"></path>
          </g>
        </svg>
        <input
          type="text"
          className="input-name"
          name="name"
          placeholder="Ingresa tu nombre"
          onChange={handleChange}
          value={formData.name}
        />
      </div>
      {errors.name && <p className="error">{errors.name}</p>}

      {/* Email */}
      <div className="flex-column">
        <label>Email</label>
      </div>
      <div className="inputForm">
        <svg
          height="20"
          viewBox="0 0 32 32"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Layer_3" data-name="Layer 3">
            <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
          </g>
        </svg>
        <input
          type="text"
          className="input-name"
          name="email"
          placeholder="Ingresa tu Email"
          onChange={handleChange}
          value={formData.email}
        />
      </div>

      {/* Teléfono */}
      <div className="flex-column">
        <label>Teléfono</label>
      </div>
      <div className="inputForm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          width="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.91 19.91 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.13 1.23.49 2.42 1.05 3.53a2 2 0 0 1-.45 2.18l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.18-.45 15.89 15.89 0 0 0 3.53 1.05 2 2 0 0 1 1.72 2z" />
        </svg>
        <input
          type="text"
          className="input-name"
          name="phone_number"
          placeholder="Ingresa tu teléfono"
          onChange={handleChange}
          value={formData.phone_number}
        />
      </div>
      {errors.phone_number && <p className="error">{errors.phone_number}</p>}

      {/* Contraseña */}
      <div className="flex-column">
        <label>Contraseña</label>
      </div>
      <div className="inputForm">
        <svg
          height="20"
          viewBox="-64 0 512 512"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
          <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
        </svg>
        <input
          type="password"
          className="input-name"
          name="password"
          placeholder="Ingresa tu contraseña"
          onChange={handleChange}
          value={formData.password}
        />
      </div>
      {errors.password && <p className="error">{errors.password}</p>}

      <button className="button-submit" type="submit">
        Regístrate
      </button>
      <p className="p">
        ¿Ya tienes una cuenta?{" "}
        <span
          style={{ color: "#b67d4b", cursor: "pointer" }}
          onClick={switchToLogin}
        >
          Inicia Sesión
        </span>
      </p>
    </form>
  );
};

export default SignupForm;
