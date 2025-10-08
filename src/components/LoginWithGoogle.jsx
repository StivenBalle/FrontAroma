import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import Swal from "sweetalert2";
import "../styles/header.css";

const LoginWithGoogle = () => {
  const { googleLogin, closeAuthModal } = useContext(AuthContext);

  useEffect(() => {
    // Verificar VITE_GOOGLE_CLIENT_ID
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      console.error("❌ VITE_GOOGLE_CLIENT_ID no está definido en .env");
      Swal.fire("Error", "Configuración de Google no disponible", "error");
      return;
    }

    // Cargar el script de Google Identity Services
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              const result = await googleLogin(response.credential);
              if (result.success) {
                Swal.fire({
                  icon: "success",
                  title: `Bienvenido, ${result.user?.name}`,
                  text: "Has iniciado sesión con Google.",
                  timer: 2000,
                  showConfirmButton: false,
                });
                closeAuthModal();
              } else {
                Swal.fire(
                  "Error",
                  result.error || "No se pudo iniciar sesión con Google.",
                  "error"
                );
              }
            } catch (error) {
              console.error("Error en el callback de Google:", error);
              Swal.fire("Error", "Fallo la autenticación con Google.", "error");
            }
          },
          ux_mode: "popup",
          auto_select: false, // Desactivamos auto_select para forzar el popup
          itp_support: true, // Soporte para FedCM/ITP
        });

        // Asociar el flujo de Google al botón personalizado
        const googleButton = document.getElementById("login-btn-google");
        if (googleButton) {
          googleButton.onclick = () => {
            if (!hasCookieConsent()) {
              Swal.fire({
                icon: "error",
                title: "Cookies necesarias",
                text: "Debes aceptar las cookies para iniciar sesión con Google.",
              });
              return;
            }
            window.google.accounts.id.prompt((notification) => {
              if (
                notification.isNotDisplayed() ||
                notification.isSkippedMoment()
              ) {
                const reason =
                  notification.getNotDisplayedReason() ||
                  notification.getSkippedReason();
                console.log("Prompt no mostrado o cancelado:", reason);
                if (reason === "opt_out_or_no_session") {
                  Swal.fire({
                    icon: "info",
                    title: "No estás logueado con Google",
                    text: "Por favor, inicia sesión en tu cuenta de Google en el navegador y vuelve a intentarlo.",
                  });
                } else if (reason === "unknown_reason") {
                  Swal.fire({
                    icon: "warning",
                    title: "No se pudo mostrar el inicio de sesión",
                    text: "Asegúrate de no tener bloqueadores de popups o cookies de terceros desactivadas.",
                  });
                } else if (reason === "tap_outside") {
                  console.log("Usuario hizo clic fuera del popup");
                  // Ignoramos tap_outside para evitar alertas molestas
                } else {
                  console.log("Razón del fallo del prompt:", reason);
                }
              }
            });
          };
        } else {
          console.error("❌ Botón de Google no encontrado (#login-btn-google)");
          Swal.fire("Error", "Botón de Google no encontrado", "error");
        }
      } catch (err) {
        console.error("❌ Error inicializando Google Sign-In:", err.message);
        Swal.fire("Error", "No se pudo inicializar Google Sign-In", "error");
      }
    };

    script.onerror = () => {
      console.error("❌ Error al cargar el script de Google");
      Swal.fire("Error", "No se pudo cargar el script de Google", "error");
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [googleLogin, closeAuthModal]);

  // Función para verificar consentimiento de cookies
  const hasCookieConsent = () => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name] = value;
      return acc;
    }, {});
    return cookies["cookie_consent"] === "true";
  };

  return (
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
      <span>Iniciar Sesión con Google</span>
    </button>
  );
};

export default LoginWithGoogle;
