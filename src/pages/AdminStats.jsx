import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { getSalesByMonth, getTopProducts, getUsersByMonth } from "../api";
import withAdminGuard from "../hocs/withAdminGuard.jsx";
import "../App.css";

const AdminStats = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [salesRes, productsRes, usersRes] = await Promise.all([
          getSalesByMonth(),
          getTopProducts(),
          getUsersByMonth(),
        ]);
        setSales(salesRes || []);
        setTopProducts(productsRes || []);
        setNewUsers(usersRes || []);
      } catch (err) {
        console.error("Error al obtener estadísticas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-products">
        <div className="loading-content">
          <div className="spinner"></div>
          <h3>Cargando estadísticas...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>📊 Estadísticas Generales</h2>
        <button onClick={() => navigate("/admin")} className="back-btn">
          ← Volver al Dashboard
        </button>
      </div>
      <div className="charts-grid">
        {/* Gráfica 1: Ventas por mes */}
        <div className="chart-card">
          <h3>Ventas por mes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total_ventas"
                stroke="#4CAF50"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica 2: Productos más vendidos */}
        <div className="chart-card">
          <h3>Productos más vendidos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="producto" />
              <YAxis domain={[0, 200]} />
              <Tooltip />
              <Bar dataKey="cantidad_vendida" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica 3: Nuevos usuarios */}
        <div className="chart-card">
          <h3>Usuarios nuevos por mes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={newUsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis domain={[0, 200]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="nuevos_usuarios"
                stroke="#FF9800"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default withAdminGuard(AdminStats);
