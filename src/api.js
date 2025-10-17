import Swal from "sweetalert2";
const API_URL = import.meta.env.VITE_API_URL;

let navigateRef = null;
export const setNavigate = (navigate) => {
  navigateRef = navigate;
};

async function request(path, { method = "GET", body } = {}) {
  const url = `${API_URL}${path}`;
  console.log(`🌐 Fetch: ${method} ${url}`);

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
      if (navigateRef) {
        await Swal.fire({
          icon: "warning",
          title: "Sesión expirada",
          text: "Tu sesión ha terminado. Si deseas continuar disfrutando de nuestros servicios inicia sesión nuevamente",
          confirmButtonText: "Aceptar",
        });
        navigateRef("/");
      } else {
        console.warn(
          "Sesion expirada detectada pero `navigate` no está seteado"
        );
      }
      throw new Error("Sesión expirada");
    }

    const error = new Error(
      data?.error || `Error ${res.status}: ${res.statusText}`
    );
    error.status = res.status;
    throw error;
  }

  return data;
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
