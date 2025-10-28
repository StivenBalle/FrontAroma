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
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { getSalesByMonth, getTopProducts, getUsersByMonth } from "../api";
import withAdminGuard from "../hocs/withAdminGuard.jsx";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/AdminStats.css";

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

  // Calcular métricas clave
  const totalSales = sales.reduce(
    (sum, item) => sum + (Number(item.total_ventas) || 0),
    0
  );
  const totalProducts = topProducts.reduce(
    (sum, item) => sum + (Number(item.cantidad_vendida) || 0),
    0
  );
  const totalNewUsers = newUsers.reduce(
    (sum, item) => sum + (item.nuevos_usuarios || 0),
    0
  );
  const avgSalesPerMonth =
    sales.length > 0 ? (totalSales / sales.length).toFixed(2) : 0;

  // Custom Tooltip para las gráficas
  const CustomTooltip = ({
    active,
    payload,
    label,
    prefix = "",
    suffix = "",
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            {prefix}
            {payload[0].value}
            {suffix}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <LoadingScreen
        title="Cargando estadísticas..."
        subtitle="Preparando tus datos analíticos"
      />
    );
  }

  return (
    <div className="admin-stats-page">
      {/* Header */}
      <div className="stats-page-header">
        <div className="header-content">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="header-text">
            <h1 className="stats-page-title">Estadísticas y Análisis</h1>
            <p className="stats-page-subtitle">
              Monitorea el rendimiento de tu negocio en tiempo real
            </p>
          </div>
        </div>
        <button onClick={() => navigate("/admin")} className="back-btn-stats">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al Dashboard
        </button>
      </div>

      {/* Métricas principales */}
      <div className="metrics-grid">
        <div className="metric-card sales-metric">
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-label">Ventas Totales</span>
            <span className="metric-value">${totalSales.toFixed(2)}</span>
            <span className="metric-subtitle">
              En {sales.length} meses registrados
            </span>
          </div>
        </div>

        <div className="metric-card products-metric">
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-label">Productos Vendidos</span>
            <span className="metric-value">{totalProducts}</span>
            <span className="metric-subtitle">Unidades totales</span>
          </div>
        </div>

        <div className="metric-card users-metric">
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-label">Usuarios Nuevos</span>
            <span className="metric-value">{totalNewUsers}</span>
            <span className="metric-subtitle">Total registrados</span>
          </div>
        </div>

        <div className="metric-card average-metric">
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-label">Promedio Mensual</span>
            <span className="metric-value">${avgSalesPerMonth}</span>
            <span className="metric-subtitle">Ventas por mes</span>
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="charts-container">
        {/* Ventas por mes */}
        <div className="chart-card-modern">
          <div className="chart-header">
            <div className="chart-title-wrapper">
              <div className="chart-icon sales-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="chart-title">Ventas Mensuales</h3>
                <p className="chart-subtitle">
                  Evolución de ingresos en el tiempo
                </p>
              </div>
            </div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={sales}
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="mes"
                  stroke="#6b7280"
                  style={{ fontSize: "0.875rem" }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "0.875rem" }} />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Line
                  type="monotone"
                  dataKey="total_ventas"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                  fill="url(#colorSales)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className="chart-card-modern">
          <div className="chart-header">
            <div className="chart-title-wrapper">
              <div className="chart-icon products-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="chart-title">Top Productos</h3>
                <p className="chart-subtitle">Los más vendidos del período</p>
              </div>
            </div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topProducts}
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="colorProducts"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="producto"
                  stroke="#6b7280"
                  style={{ fontSize: "0.875rem" }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "0.875rem" }} />
                <Tooltip content={<CustomTooltip suffix=" unidades" />} />
                <Bar
                  dataKey="cantidad_vendida"
                  fill="url(#colorProducts)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Usuarios nuevos */}
        <div className="chart-card-modern">
          <div className="chart-header">
            <div className="chart-title-wrapper">
              <div className="chart-icon users-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="chart-title">Crecimiento de Usuarios</h3>
                <p className="chart-subtitle">Nuevos registros mensuales</p>
              </div>
            </div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={newUsers}
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="mes"
                  stroke="#6b7280"
                  style={{ fontSize: "0.875rem" }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "0.875rem" }} />
                <Tooltip content={<CustomTooltip suffix=" usuarios" />} />
                <Line
                  type="monotone"
                  dataKey="nuevos_usuarios"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                  fill="url(#colorUsers)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminGuard(AdminStats);
