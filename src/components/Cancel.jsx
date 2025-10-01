import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Cancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      icon: "error",
      title: "Pago Cancelado",
      text: "Hubo un error al intentar procesar el pago o el usuario canceló la transacción.",
      confirmButtonText: "Volver a intentar",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div class="card_cancel">
      <div class="header_cancel">
        <div class="image_cancel">
          <svg
            aria-hidden="true"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              stroke-linejoin="round"
              stroke-linecap="round"
            ></path>
          </svg>
        </div>
        <div class="content_cancel">
          <h3 class="title_cancel">Tu pago no pudo ser procesado</h3>
          <p class="message_cancel">
            Puede que haya sido cancelado o rechazado por tu banco. Por favor,
            verifica tus datos e intenta nuevamente o utiliza otro método de
            pago. No pierdas está oportunidad de probar un café puro y
            tradicional.
          </p>
        </div>
        <div class="actions_cancel">
          <button
            class="cancel_pay"
            type="button"
            onClick={() => navigate("/")}
          >
            Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
