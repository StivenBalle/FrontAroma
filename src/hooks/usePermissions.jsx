import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Hook para verificar permisos del usuario
 * @returns {Object} Objeto con funciones de verificación de permisos
 */
export const usePermissions = () => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) {
      return {
        isAdmin: false,
        isViewer: false,
        isUser: false,
        canRead: false,
        canWrite: false,
        canDelete: false,
        canManageUsers: false,
        canManageOrders: false,
        canManageSecurity: false,
        canViewStats: false,
        canExport: false,
      };
    }

    const role = user.role;

    return {
      // Roles básicos
      isAdmin: role === "admin",
      isViewer: role === "viewer",
      isUser: role === "user",

      // Permisos de lectura
      canRead: ["admin", "viewer"].includes(role),

      // Permisos de escritura (crear, actualizar, eliminar)
      canWrite: role === "admin",
      canDelete: role === "admin",

      // Permisos específicos por módulo
      canManageUsers: role === "admin",
      canManageOrders: role === "admin",
      canManageSecurity: role === "admin",

      // Visualización (Admin y Viewer)
      canViewStats: ["admin", "viewer"].includes(role),
      canViewUsers: ["admin", "viewer"].includes(role),
      canViewOrders: ["admin", "viewer"].includes(role),
      canViewSecurity: ["admin", "viewer"].includes(role),

      // Exportación
      canExport: ["admin", "viewer"].includes(role),

      // Información del rol
      role: role,
      roleName:
        role === "admin"
          ? "Administrador"
          : role === "viewer"
          ? "Visualizador"
          : "Usuario",
    };
  }, [user]);

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   * @param {Array<string>} allowedRoles
   * @returns {boolean}
   */
  const hasAnyRole = (allowedRoles) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  /**
   * Verifica si el usuario tiene permiso específico
   * @param {string} permission
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    return permissions[permission] || false;
  };

  return {
    ...permissions,
    hasAnyRole,
    hasPermission,
  };
};

export default usePermissions;
