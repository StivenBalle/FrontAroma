import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Swal from "sweetalert2";
import { register } from "../../utils/api.js";
import "../../styles/header.css";
import logger from "../../utils/logger.js";
import { LockKeyhole, Mail, Phone, User } from "lucide-react";

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
        const serverMsg = data.error || data.message || "No se pudo registrar";
        if (/contraseña|carácter|mayúscula|minúscula|número/i.test(serverMsg)) {
          setErrors((prev) => ({ ...prev, password: serverMsg }));
        } else if (
          /correo|email|email inválido|ya está registrado/i.test(serverMsg)
        ) {
          setErrors((prev) => ({ ...prev, email: serverMsg }));
        }
        Swal.fire({ icon: "error", title: "❌ Error", text: serverMsg });
      }
    } catch (err) {
      logger.error("❌ Error en registro:", err);
      const serverMsg = err.body?.error || err.message || "Error al registrar";
      if (/contraseña|carácter|mayúscula|minúscula|número/i.test(serverMsg)) {
        setErrors((prev) => ({ ...prev, password: serverMsg }));
      } else if (/correo|email|ya está registrado/i.test(serverMsg)) {
        setErrors((prev) => ({ ...prev, email: serverMsg }));
      } else {
        setErrors({});
      }

      Swal.fire({
        icon: "error",
        title: "❌ Error",
        text: serverMsg,
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

      <img src="/assets/logoCafe.png" />

      {/* Nombre */}
      <div className="flex-column">
        <label>Nombre</label>
      </div>
      <div className="inputForm">
        <User strokeWidth="2.5px" />
        <input
          type="text"
          className="input-name"
          name="name"
          placeholder="Ingresa tu nombre"
          onChange={handleChange}
          value={formData.name}
        />
      </div>
      {errors.name && (
        <p style={{ color: "red", fontSize: "9px" }} className="error">
          {errors.name}
        </p>
      )}

      {/* Email */}
      <div className="flex-column">
        <label>Email</label>
      </div>
      <div className="inputForm">
        <Mail strokeWidth="2.5px" />
        <input
          type="text"
          className="input-name"
          name="email"
          placeholder="Ingresa tu Email"
          onChange={handleChange}
          value={formData.email}
        />
      </div>
      <p style={{ color: "red", fontSize: "9px" }} className="error">
        {errors.email}
      </p>

      {/* Teléfono */}
      <div className="flex-column">
        <label>Teléfono</label>
      </div>
      <div className="inputForm">
        <Phone strokeWidth="2.5px" />
        <input
          type="text"
          className="input-name"
          name="phone_number"
          placeholder="Ingresa tu teléfono"
          onChange={handleChange}
          value={formData.phone_number}
        />
      </div>
      {errors.phone_number && (
        <p style={{ color: "red", fontSize: "9px" }} className="error">
          {errors.phone_number}
        </p>
      )}

      {/* Contraseña */}
      <div className="flex-column">
        <label>Contraseña</label>
      </div>
      <div className="inputForm">
        <LockKeyhole strokeWidth="2.5px" />
        <input
          type="password"
          className="input-name"
          name="password"
          placeholder="Ingresa tu contraseña"
          onChange={handleChange}
          value={formData.password}
        />
      </div>
      {errors.password && (
        <p style={{ color: "red", fontSize: "9px" }} className="error">
          {errors.password}
        </p>
      )}

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
