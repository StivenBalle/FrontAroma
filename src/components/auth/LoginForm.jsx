import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import LoginGoogle from "../../components/auth/LoginWithGoogle.jsx";
import LogoCafe from "../../assets/LogoCafe.png";
import logger from "../../utils/logger";
import "../../styles/header.css";
import { LockKeyhole, Mail } from "lucide-react";

const LoginForm = ({ switchToSignup }) => {
  const { login, closeAuthModal } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email_login.value;
    const password = e.target.password_login.value;

    const res = await login(email, password);
    logger.log("Respuesta del login:", res);

    if (!res.success) {
      return;
    }
    logger.log(`El usuario inició sesión exitosamente.`);
  };

  return (
    <div className="div-login" id="loginForm">
      <button type="button" className="button_close" onClick={closeAuthModal}>
        <span className="X"></span>
        <span className="Y"></span>
        <div className="close">Cerrar</div>
      </button>

      <img src={LogoCafe} />
      <h3 className="title-login">Iniciar Sesión</h3>

      <form className="form-login" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="flex-column">
          <label>Correo</label>
        </div>
        <div className="inputForm">
          <Mail strokeWidth="2.5px" />
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
          <LockKeyhole strokeWidth="2px" />
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

        <button className="sign-login" type="submit">
          Iniciar Sesión
        </button>
      </form>

      <div className="social-message">
        <div className="line"></div>
        <p className="message">Inicia Sesión con Google</p>
        <div className="line"></div>
      </div>
      <LoginGoogle />
      <p className="signup">
        ¿No tienes cuenta?{" "}
        <span
          style={{ color: "#b67d4b", cursor: "pointer" }}
          onClick={switchToSignup}
        >
          Regístrate
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
