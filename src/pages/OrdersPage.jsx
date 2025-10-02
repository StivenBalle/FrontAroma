import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Cafetera from "../components/Cafetera.jsx";
import { getAdminOrders } from "../api.js";
import Swal from "sweetalert2";
import "../App.css";

const OrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      Swal.fire({ icon: "warning", title: "Acceso denegado" }).then(() =>
        navigate("/")
      );
      return;
    }
    fetchOrders();
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      const data = await getAdminOrders();
      console.log("Órdenes recibidas en frontend:", data.orders); // Para depuración
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
      setCurrentPage(1);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar las órdenes", "error");
    } finally {
      setPageLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchLoading(true);
    const filtered = orders.filter((order) =>
      order.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log("Órdenes filtradas:", filtered); // Para depuración
    setFilteredOrders(filtered);
    setCurrentPage(1);
    setTimeout(() => setSearchLoading(false), 500);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredOrders(orders);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (authLoading || pageLoading) {
    return (
      <div className="loading-products">
        <div className="loading-content">
          <div className="spinner"></div>
          <h3>Cargando información...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Buscar Compras</h1>
        <button onClick={() => navigate("/admin")} className="back-btn">
          ← Volver al Dashboard
        </button>
      </div>
      <form className="form_orders" onSubmit={handleSearch}>
        <button type="submit">
          <svg
            width="17"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="search"
          >
            <path
              d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
              stroke="currentColor"
              strokeWidth="1.333"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
        <input
          className="input_search"
          placeholder="Buscar por correo"
          required=""
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="reset" type="reset" onClick={handleReset}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </form>
      {searchLoading ? (
        <div className="loading-products">
          <div className="loading-content">
            <div className="spinner"></div>
            <h3>Buscando...</h3>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text_no_orders">
          <Cafetera />
          <p>No hay órdenes registradas.</p>
        </div>
      ) : (
        <>
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Usuario</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    {order.user_name} ({order.user_email})
                  </td>
                  <td>{order.producto}</td>
                  <td>${Number(order.precio).toFixed(2)}</td>
                  <td>{order.phone || "N/A"}</td>
                  <td>
                    {order.shipping_address ? (
                      <div>
                        <p>{order.shipping_address.line1}</p>
                        <p>
                          {order.shipping_address.city},{" "}
                          {order.shipping_address.country}
                        </p>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.fecha).toLocaleDateString("es-CO")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ⇦
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              ⇨
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
