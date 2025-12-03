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
import {
  getSalesByMonth,
  getTopProducts,
  getUsersByMonth,
} from "../../utils/api.js";
import withAdminGuard from "../../hooks/withAdminGuard.jsx";
import { useMinimumLoadingTime } from "../../hooks/useMinimumLoading.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import withSessionGuard from "../../hooks/withSessionGuard.jsx";
import usePermissions from "../../hooks/usePermissions.jsx";
import { useModernAlert } from "../../hooks/useModernAlert.jsx";
import "../../styles/AdminStats.css";
import logger from "../../utils/logger.js";
import {
  Box,
  ChartColumnBig,
  CircleDollarSign,
  MoveLeft,
  Receipt,
  TrendingUp,
  Users,
  Lock,
} from "lucide-react";

const AdminStats = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const showLoading = useMinimumLoadingTime(loading, 1000);
  const { alert, error } = useModernAlert();
  const permissions = usePermissions();

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
        error("Error", "Error al obtener las estadísticas");
        logger.error("Error al obtener estadísticas:", err);
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

  if (showLoading) {
    return (
      <LoadingScreen
        title="Cargando estadísticas..."
        subtitle="Preparando tus datos analíticos"
      />
    );
  }

  return (
    <div className="admin-stats-page">
      {permissions.isViewer && (
        <div className="viewer-banner">
          <Lock size={18} />
          <span>Modo de solo lectura - No puedes realizar modificaciones</span>
        </div>
      )}
      {/* Header */}
      <div className="stats-page-header">
        <div className="header-content">
          <div className="header-icon-stats">
            <ChartColumnBig strokeWidth="2.5px" />
          </div>
          <div className="header-text">
            <h1 className="stats-page-title">Estadísticas y Análisis</h1>
            <p className="stats-page-subtitle">
              Monitorea el rendimiento de tu negocio en tiempo real
            </p>
          </div>
        </div>
        <button onClick={() => navigate("/admin")} className="back-btn-stats">
          <MoveLeft strokeWidth="2.5px" />
          Volver al Dashboard
        </button>
      </div>

      {/* Métricas principales */}
      <div className="metrics-grid">
        <div className="metric-card sales-metric">
          <div className="metric-icon">
            <CircleDollarSign strokeWidth="2.5px" />
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
            <Box strokeWidth="2.5px" />
          </div>
          <div className="metric-content">
            <span className="metric-label">Productos Vendidos</span>
            <span className="metric-value">{totalProducts}</span>
            <span className="metric-subtitle">Unidades totales</span>
          </div>
        </div>

        <div className="metric-card users-metric">
          <div className="metric-icon">
            <Users strokeWidth="2.5px" />
          </div>
          <div className="metric-content">
            <span className="metric-label">Usuarios Nuevos</span>
            <span className="metric-value">{totalNewUsers}</span>
            <span className="metric-subtitle">Total registrados</span>
          </div>
        </div>

        <div className="metric-card average-metric">
          <div className="metric-icon">
            <TrendingUp strokeWidth="2.5px" />
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
                <Receipt strokeWidth="2.5px" />
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
                <Box strokeWidth="2.5px" />
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
                <Users strokeWidth="2.5px" />
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
      {alert}
    </div>
  );
};

export default withSessionGuard(withAdminGuard(AdminStats));
