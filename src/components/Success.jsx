import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: "¡Pago Exitoso!",
      icon: "success",
      text: "Tu pago se ha procesado correctamente.",
      confirmButtonText: "Volver al inicio",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div class="notifications-container">
      <div class="success">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="succes-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <div class="success-prompt-wrap">
            <h3 class="success-prompt-heading">¡Gracias por tu compra! 🙌</h3>
            <div class="success-prompt-prompt">
              <p>
                Tu café ha sido preparado con dedicación y cariño. Al hacer una
                compra en Café Aroma de la Serrania contribuyes a nuestro
                crecimiento para llevar un café de calidad a cada rincón del
                país. Esperamos que disfrutes cada sorbo tanto como nosotros
                disfrutamos hacerlo para ti. ¡Vuelve pronto!
              </p>
            </div>
            <div class="success-button-container">
              <button
                type="button"
                class="success-button-main"
                onClick={() => navigate("/")}
              >
                Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
