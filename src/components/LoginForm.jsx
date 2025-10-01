import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import logoCafe from "../assets/LogoCafe.png";
import Swal from "sweetalert2";
import "../styles/header.css";

const LoginForm = ({ switchToSignup }) => {
  const { login, closeAuthModal } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email_login.value;
    const password = e.target.password_login.value;

    const res = await login(email, password);
    console.log("Respuesta del login:", res);

    if (res.success) {
      console.log(`El usuario, ${res.user?.name} inicio sesión exitosamente`);
    } else {
      Swal.fire("Error", res.error, "error");
    }
  };

  return (
    <div className="div-login" id="loginForm">
      <button type="button" className="button_close" onClick={closeAuthModal}>
        <span className="X"></span>
        <span className="Y"></span>
        <div className="close">Cerrar</div>
      </button>

      <img src={logoCafe} alt="Logo Café" />
      <h3 className="title-login">Iniciar Sesión</h3>

      <form className="form-login" onSubmit={handleSubmit}>
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

      <button
        className="btn google"
        id="login-btn-google"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "10px 20px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: "white",
          cursor: "pointer",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="20"
          height="20"
        >
          <path
            d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
      c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
      C103.821,274.792,107.225,292.797,113.47,309.408z"
            fill="#FBBB00"
          />
          <path
            d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
      c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
      c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
            fill="#518EF8"
          />
          <path
            d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
      c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
      c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
            fill="#28B446"
          />
          <path
            d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
      c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
      C318.115,0,375.068,22.126,419.404,58.936z"
            fill="#F14336"
          />
        </svg>
        <span>Google</span>
      </button>

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
