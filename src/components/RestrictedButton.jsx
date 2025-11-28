import React from "react";
import { usePermissions } from "../hooks/usePermissions.jsx";
import Swal from "sweetalert2";

/* Botón que se deshabilita automáticamente para usuarios sin permisos
 * Muestra tooltip explicativo cuando está deshabilitado
 */

const RestrictedButton = ({
  children,
  onClick,
  requiredPermission = "canWrite",
  className = "",
  disabled = false,
  showTooltip = true,
  tooltipMessage = "No tienes permisos para realizar esta acción",
  ...props
}) => {
  const permissions = usePermissions();
  const hasPermission = permissions[requiredPermission];
  const isDisabled = disabled || !hasPermission;

  const handleClick = (e) => {
    if (!hasPermission) {
      e.preventDefault();

      Swal.fire({
        icon: "warning",
        title: "Acceso restringido",
        html: `
          <div style="text-align: center;">
            <p>${tooltipMessage}</p>
            <p style="margin-top: 10px; color: #6b7280; font-size: 14px;">
              Tu rol actual: <strong>${permissions.roleName}</strong>
            </p>
            ${
              permissions.isViewer
                ? `<p style="margin-top: 10px; color: #f59e0b; font-size: 13px;">
                    Los visualizadores solo pueden ver información, no modificarla.
                  </p>`
                : ""
            }
          </div>
        `,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#6b7280",
      });

      return;
    }

    if (onClick) onClick(e);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`${className} ${
        isDisabled ? "opacity-60 cursor-not-allowed restricted" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default RestrictedButton;
