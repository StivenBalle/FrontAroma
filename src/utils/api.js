import Swal from "sweetalert2";
import logger from "../utils/logger";

const API_URL = import.meta.env.VITE_API_URL;

let navigateRef = null;
let logoutCallback = null;
let setUserRef = null;

export const setNavigate = (navigate) => {
  navigateRef = navigate;
};

export const setLogoutHandler = (fn) => {
  logoutCallback = fn;
};

export const setUserHandler = (fn) => {
  setUserRef = fn;
};

async function request(path, { method = "GET", body } = {}) {
  const url = `${API_URL}${path}`;
  logger.log(`🌐 Fetch: ${method} ${url}`);

  const options = {
    method,
    credentials: "include",
  };

  // Si el body NO es FormData, se envía como JSON
  if (body && !(body instanceof FormData)) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    options.body = body;
  }

  const res = await fetch(`${API_URL}${path}`, options);

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    // ⚡ Detectar sesión expirada
    if (res.status === 401 && data?.error === "Sesión expirada") {
      await handleSessionExpired();
      throw new Error("Sesión expirada");
    }

    // 🚫 Detectar cuenta bloqueada (status 423 = Locked)
    if (res.status === 423) {
      await handleAccountLocked(data);
      throw new Error("Cuenta bloqueada");
    }

    const error = new Error(
      data?.error || `Error ${res.status}: ${res.statusText}`
    );
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Manejo de sesión expirada
async function handleSessionExpired() {
  if (navigateRef) {
    await Swal.fire({
      icon: "warning",
      title: "Sesión expirada",
      text: "Tu sesión ha terminado. Si deseas continuar disfrutando de nuestros servicios inicia sesión nuevamente",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (logoutCallback && setUserRef) {
      setUserRef(null);
      await logoutCallback();
    }
    window.location.reload();
  } else {
    logger.warn("Sesión expirada detectada pero `navigate` no está seteado");
  }
}

// 🚫 Manejo de cuenta bloqueada
async function handleAccountLocked(data) {
  if (navigateRef) {
    const isPermanent =
      data.code === "ACCOUNT_PERMANENTLY_LOCKED" || data.isPermanent;

    let message;
    if (isPermanent) {
      message =
        "Tu cuenta ha sido bloqueada permanentemente por un administrador. Contacta con soporte para más información.";
    } else if (data.remainingMin) {
      message = `Tu cuenta ha sido bloqueada temporalmente. Podrás acceder nuevamente en ${
        data.remainingMin
      } minuto${data.remainingMin > 1 ? "s" : ""}.`;
    } else {
      message =
        data.message ||
        "Tu cuenta ha sido bloqueada. Contacta al administrador.";
    }

    await Swal.fire({
      icon: "error",
      title: isPermanent
        ? "Cuenta bloqueada permanentemente"
        : "Cuenta bloqueada",
      html: `
        <p>${message}</p>
        ${
          data.lock_reason
            ? `<p style="margin-top: 10px; color: #666;"><strong>Razón:</strong> ${data.lock_reason}</p>`
            : ""
        }
        ${
          isPermanent
            ? '<p style="margin-top: 15px; color: #dc2626; font-weight: bold;">Este bloqueo es permanente y requiere intervención del administrador.</p>'
            : ""
        }
      `,
      confirmButtonText: "Entendido",
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: "#dc2626",
    });

    // Cerrar sesión automáticamente
    if (logoutCallback && setUserRef) {
      setUserRef(null);
      await logoutCallback();
    }
    window.location.reload();
  } else {
    logger.warn("Cuenta bloqueada detectada pero `navigate` no está seteado");
  }
}

// 🔹 Helpers
const get = (path) => request(path);
const post = (path, body) => request(path, { method: "POST", body });
const put = (path, body) => request(path, { method: "PUT", body });
const del = (path) => request(path, { method: "DELETE" });

// 🔹 Funciones específicas
export const login = (email, password) =>
  post("/api/auth/login", { email, password });

export const register = (name, phone_number, email, password) =>
  post("/api/auth/register", { name, phone_number, email, password });

export const getProfile = () => get("/api/auth/profile");

export const getHistorial = () => get("/api/historial");

export const getAdminOrders = () => get("/api/admin/orders");

export const getConfig = () => get("/api/config");

export const getProducts = () => get("/api/products");

export const logout = () => post("/api/auth/logout");

export const createCheckout = (priceId) =>
  post("/api/create-checkout-session", { priceId });

export const getUsers = (searchTerm = "") => {
  const params = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
  return get(`/api/admin/users${params}`);
};

export const deleteUser = (userId) => del(`/api/admin/users/${userId}`);

export const updateUserRole = (userId, newRole) =>
  put(`/api/admin/users/${userId}/role`, { role: newRole });

export const googleLogin = ({ credential, nonce }) =>
  post("/api/auth/google", { credential, nonce });

export const updatePhone = (phone_number) =>
  put("/api/auth/update-phone", { phone_number });

export const getPurchaseDetails = async (sessionId) =>
  get(`/api/stripe/purchase/${sessionId}`);

export const getSalesByMonth = () => get("/api/admin/stats/sales-by-month");

export const getTopProducts = () => get("/api/admin/stats/top-products");

export const getUsersByMonth = () => get("/api/admin/stats/users-by-month");

export const getUserProfile = () => get("/api/user/profile");

export const getShippingAddress = () => get("/api/user/shipping-address");

export const updateShippingAddress = (data) =>
  put("/api/user/update/shipping-address", data);

export const createShippingAddress = (data) =>
  post("/api/user/add/shipping-address", data);

export const updateUserProfile = (data) => put("/api/user/update", data);

export const uploadProfileImage = (formData) =>
  post("/api/user/profile-image", formData);

export const deleteProfileImage = () => del("/api/user/delete-image");

// Obtener perfil de un usuario específico por ID (para admin)
export const getUserProfileById = (userId) => get(`/api/admin/users/${userId}`);

// Obtener historial de compras de un usuario específico (para admin)
export const getHistorialByUserId = (userId) =>
  get(`/api/admin/users/${userId}/historial`);

export const updateOrderStatus = (orderId, status) =>
  request(`/api/admin/change-order/${orderId}/status`, {
    method: "PATCH",
    body: { status },
  });

export const createReview = (reviewData) =>
  post("/api/user/reviews", reviewData);

export const getReviews = () => get("/api/user/reviews");

export const checkOrderReview = (orderId) =>
  get(`/api/user/reviews/order/${orderId}`);

export const updatePassword = (body) => put("/api/user/password", body);

export const getSecurityUsers = async (
  search = "",
  filter = "all",
  page = 1
) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (filter && filter !== "all") params.append("filter", filter);
  if (page > 1) params.append("page", page);

  return await get(`/api/admin/security/users?${params.toString()}`);
};

export const unlockUserAccount = (userId) =>
  post(`/api/admin/security/users/${userId}/unlock`);

export const lockUserAccount = (
  userId,
  { duration = 15, reason = "Manual por admin", permanent = false }
) =>
  post(`/api/admin/security/users/${userId}/lock`, {
    duration,
    reason,
    permanent,
  });

export const resetUserAttempts = (userId) =>
  post(`/api/admin/security/users/${userId}/reset-attempts`);

export const getUserSecurityDetails = (userId) =>
  get(`/api/admin/security/users/${userId}/details`);

export const getSecurityStats = () => get("/api/admin/security/stats");

export const exportSecurityLogs = () => get("/api/admin/security/logs/export");

export const getLogs = (params = {}) => {
  const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== "ALL") {
      acc[key] = value;
    }
    return acc;
  }, {});

  const query = new URLSearchParams(filteredParams).toString();
  return get(`/api/logs?${query}`);
};

export const deleteLogs = (days) => {
  return del(`/api/logs?days=${days}`);
};
