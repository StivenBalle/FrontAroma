const API_URL = import.meta.env.VITE_API_URL;

// 🔹 Cliente genérico
async function request(path, { method = "GET", body } = {}) {
  if (!API_URL) {
    console.error(
      "❌ API_URL no definida. Variables disponibles:",
      import.meta.env
    );
    throw new Error("Configuración de API no disponible");
  }

  const url = `${API_URL}${path}`;
  console.log(`🌐 Fetch: ${method} ${url}`);

  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, options);

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
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
