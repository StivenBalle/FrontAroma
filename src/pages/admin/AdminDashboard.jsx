import React from "react";
import { useNavigate } from "react-router-dom";
import withAdminGuard from "../../hooks/withAdminGuard.jsx";
import withSessionGuard from "../../hooks/withSessionGuard.jsx";
import "../../App.css";
import usePermissions from "../../hooks/usePermissions.jsx";
import HeaderTitle from "../../components/HeaderTitle.jsx";
import { Card, Row, Col, Typography, Alert } from "antd";
import {
  ChartColumnBig,
  CircleUser,
  Logs,
  Search,
  Trash2,
  UserLock,
  UserSearch,
  UserStar,
  Lock,
} from "lucide-react";

const { Title, Text } = Typography;

const AdminOrdersInner = () => {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const cards = [
    {
      title: "Buscar Compras",
      desc: "Ver y filtrar historial de órdenes",
      path: "/admin/orders",
      icon: <Search size={40} strokeWidth={2.5} />,
    },
    {
      title: "Buscar Usuario",
      desc: "Localizar usuarios por nombre o email",
      path: "/admin/users/search",
      icon: <UserSearch size={40} strokeWidth={2.5} />,
    },
    {
      title: "Borrar Usuario",
      desc: "Eliminar cuentas de usuarios",
      path: "/admin/users/delete",
      icon: <Trash2 size={40} strokeWidth={2.5} />,
    },
    {
      title: "Cambiar Rol de Usuario",
      desc: "Promover o degradar a admin/user",
      path: "/admin/users/role",
      icon: <CircleUser size={40} strokeWidth={2.5} />,
    },
    {
      title: "Estadísticas",
      desc: "Ventas, productos y usuarios nuevos",
      path: "/admin/stats",
      icon: <ChartColumnBig size={40} strokeWidth={2.5} />,
    },
    {
      title: "Reseñas",
      desc: "Revisa las reseñas que han dejado tus clientes",
      path: "/admin/reviews",
      icon: <UserStar size={40} strokeWidth={2.5} />,
    },
    {
      title: "Administrar Cuentas",
      desc: "Bloquea, desbloquea y monitorea las cuentas",
      path: "/admin/security-accounts",
      icon: <UserLock size={40} strokeWidth={2.5} />,
    },
    {
      title: "Revisión Logs",
      desc: "Monitorea los logs y eventos de tus clientes",
      path: "/admin/logs-viewer",
      icon: <Logs size={40} strokeWidth={2.5} />,
    },
  ];

  return (
    <div className="admin-dashboard">
      {permissions.isViewer && (
        <div className="viewer-banner">
          <Lock size={18} />
          <span>Modo de solo lectura - No puedes realizar modificaciones</span>
        </div>
      )}

      <HeaderTitle
        title="Panel de Administración"
        subtitle="Administra la página y controla los usuarios"
        backPath="/"
        backText="Volver al inicio"
      />

      <Row gutter={[24, 24]} style={{ marginTop: "20px" }}>
        {cards.map((card, index) => (
          <Col xs={24} sm={12} md={12} lg={8} xl={6} key={index}>
            <Card
              hoverable
              className="admin-card-button stats-card"
              onClick={() => handleNavigate(card.path)}
              style={{
                borderRadius: "14px",
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
                maxHeight: "180px",
              }}
            >
              <div style={{ marginBottom: "10px" }}>{card.icon}</div>

              <Title
                level={4}
                style={{
                  margin: 0,
                  fontFamily: "Georgia, serif",
                  color: "#4a2c2a",
                }}
              >
                {card.title}
              </Title>

              <Text type="secondary">{card.desc}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default withSessionGuard(withAdminGuard(AdminOrdersInner));
