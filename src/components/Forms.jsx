import React, { useState } from "react";
import logoCafe from "../assets/LogoCafe.png";
import { useAuth } from "../context/AuthContext";

export default function Forms() {
  const { authModalOpen, closeAuthModal, login } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (!authModalOpen) return null;

  // Manejo de submit login
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email_login.value;
    const password = e.target.password_login.value;

    const res = await login(email, password);
    if (res.success) {
      closeAuthModal();
    } else {
      alert(res.error || "Error al iniciar sesión");
    }
  };

  // Manejo de submit registro
  const handleSignup = async (e) => {
    e.preventDefault();
    const name = e.target.name_user.value;
    const email = e.target.email_user.value;
    const phone = e.target.phone_user.value;
    const password = e.target.password_user.value;

    console.log("📩 Registrando:", { name, email, phone, password });
    // Aquí deberías llamar a /api/auth/signup
    closeAuthModal();
  };

  return (
    <div id="overlay" className="overlay">
      {/* FORMULARIO DE REGISTRO */}
      {!showLogin && (
        <form className="form" id="signupForm" onSubmit={handleSignup}>
          <button
            type="button"
            className="button_close"
            onClick={closeAuthModal}
          >
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
            <input
              type="text"
              className="input-name"
              id="name_user"
              placeholder="Ingresa tu nombre"
            />
          </div>

          {/* Email */}
          <div className="flex-column">
            <label>Email</label>
          </div>
          <div className="inputForm">
            <input
              type="text"
              className="input-name"
              id="email_user"
              placeholder="Ingresa tu Email"
            />
          </div>

          {/* Teléfono */}
          <div className="flex-column">
            <label>Teléfono</label>
          </div>
          <div className="inputForm">
            <input
              type="text"
              className="input-name"
              id="phone_user"
              placeholder="Ingresa tu teléfono"
            />
          </div>

          {/* Contraseña */}
          <div className="flex-column">
            <label>Contraseña</label>
          </div>
          <div className="inputForm">
            <input
              type="password"
              className="input-name"
              id="password_user"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button className="button-submit" type="submit">
            Regístrate
          </button>
          <p className="p">
            ¿Ya tienes una cuenta?{" "}
            <span
              style={{ color: "#b67d4b", cursor: "pointer" }}
              className="span"
              onClick={() => setShowLogin(true)}
            >
              Iniciar Sesión
            </span>
          </p>
        </form>
      )}

      {/* FORMULARIO DE LOGIN */}
      {showLogin && (
        <div className="div-login" id="loginForm">
          <button
            type="button"
            className="button_close"
            onClick={closeAuthModal}
          >
            <span className="X"></span>
            <span className="Y"></span>
            <div className="close">Cerrar</div>
          </button>

          <img src={logoCafe} alt="Logo Café" />
          <h3 className="title-login">Iniciar Sesión</h3>

          <form className="form-login" onSubmit={handleLogin}>
            {/* Email */}
            <div className="flex-column">
              <label>Correo</label>
            </div>
            <div className="inputForm">
              <input
                type="text"
                className="input-name"
                id="email_login"
                placeholder="Ingresa tu Email"
              />
            </div>

            {/* Contraseña */}
            <div className="flex-column">
              <label>Contraseña</label>
            </div>
            <div className="inputForm">
              <input
                type="password"
                className="input-name"
                id="password_login"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <div className="forgot">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <button className="sign" type="submit">
              Iniciar Sesión
            </button>
          </form>

          <div className="social-message">
            <div className="line"></div>
            <p className="message">Inicia Sesión con Google</p>
            <div className="line"></div>
          </div>

          <button className="btn google" id="login-btn-google">
            Google
          </button>

          <p className="signup">
            ¿No tienes cuenta?{" "}
            <span
              style={{ color: "#b67d4b", cursor: "pointer" }}
              onClick={() => setShowLogin(false)}
            >
              Regístrate
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
