import React from "react";
import { usePermissions } from "../hooks/usePermissions.jsx";
import { useModernAlert } from "../hooks/useModernAlert.jsx";

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
  const { alert, warning } = useModernAlert();
  const isDisabled = disabled || !hasPermission;

  const handleClick = (e) => {
    if (!hasPermission) {
      e.preventDefault();

      const htmlContent = `
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
      `;

      warning("Acceso restringido", htmlContent);

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
      {alert}
    </button>
  );
};

export default RestrictedButton;
