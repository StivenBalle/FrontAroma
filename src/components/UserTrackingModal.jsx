import React, { useEffect } from "react";
import "../App.css";

const OrderTrackingModal = ({
  order,
  onClose,
  isAdmin = false,
  onUpdateStatus,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const orderSteps = [
    {
      id: 1,
      key: "pendiente",
      title: "Pedido Realizado",
      description: "Tu pedido ha sido recibido y confirmado",
    },
    {
      id: 2,
      key: "procesando",
      title: "En Preparación",
      description: "Estamos preparando tu café con cuidado",
    },
    {
      id: 3,
      key: "enviado",
      title: "Enviado",
      description: "Tu pedido está en camino a tu dirección",
    },
    {
      id: 4,
      key: "completado",
      title: "Entregado",
      description: "Pedido entregado exitosamente",
    },
  ];

  const getCurrentStep = () => {
    const statusMap = {
      pendiente: 1,
      procesando: 2,
      enviado: 3,
      completado: 4,
      cancelado: -1,
    };
    return statusMap[order.status] || 1;
  };

  const currentStep = getCurrentStep();
  const isCompleted = order.status === "completado";
  const isCanceled = order.status === "cancelado";
  const isLocked = isCompleted || isCanceled;

  const getStepClass = (stepId) => {
    if (isCanceled) return "step-canceled";
    if (stepId < currentStep) return "step-completed";
    if (stepId === currentStep) return "step-active";
    return "step-pending";
  };

  const handleStatusChange = (newStatus) => {
    if (onUpdateStatus && !isLocked) {
      onUpdateStatus(order.id, newStatus);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />

      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-header-content">
            <h2 className="modal-title">Seguimiento de Pedido</h2>
            <p className="modal-order-number">Orden #{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Cerrar modal"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Información del pedido */}
        <div className="order-summary">
          <div className="order-summary-item">
            <span className="summary-label">Producto</span>
            <span className="summary-value">{order.producto}</span>
          </div>
          <div className="order-summary-item">
            <span className="summary-label">Total</span>
            <span className="summary-value summary-price">
              ${Number(order.precio).toFixed(2)}
            </span>
          </div>
          <div className="order-summary-item">
            <span className="summary-label">Fecha de compra</span>
            <span className="summary-value">{formatDate(order.fecha)}</span>
          </div>
        </div>

        {/* Barra de progreso visual */}
        {!isCanceled && (
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${(currentStep / orderSteps.length) * 100}%` }}
            />
          </div>
        )}

        {/* Stepper de estados */}
        <div className="stepper-container">
          {isCanceled ? (
            <div className="canceled-notice">
              <div className="canceled-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" />
                  <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="canceled-title">Pedido Cancelado</h3>
              <p className="canceled-description">
                Este pedido ha sido cancelado y no se procesará.
              </p>
            </div>
          ) : isCompleted ? (
            <div className="completed-notice">
              <div className="completed-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="completed-title">¡Pedido Entregado!</h3>
              <p className="completed-description">
                Tu pedido ha sido entregado exitosamente. Esperamos que
                disfrutes tu café.
              </p>
            </div>
          ) : (
            <div className="stepper-steps">
              {orderSteps.map((step, index) => {
                const stepClass = getStepClass(step.id);
                const isStepCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;

                return (
                  <div key={step.id} className={`stepper-step ${stepClass}`}>
                    <div className="step-indicator-wrapper">
                      <div className="step-indicator">
                        {isStepCompleted ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        ) : (
                          <span className="step-number">{step.id}</span>
                        )}
                      </div>
                      {index < orderSteps.length - 1 && (
                        <div className="step-connector" />
                      )}
                    </div>
                    <div className="step-content">
                      <h4 className="step-title">{step.title}</h4>
                      <p className="step-description">{step.description}</p>
                      <span className="step-status">
                        {isStepCompleted
                          ? "Completado"
                          : isActive
                          ? "En progreso"
                          : "Pendiente"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel de administración */}
        {isAdmin && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h3 className="admin-panel-title">Control de Estado</h3>
              {isLocked && (
                <span className="locked-badge">
                  {isCompleted ? "Pedido finalizado" : "Pedido cancelado"}
                </span>
              )}
            </div>

            <div className="admin-actions">
              <button
                onClick={() => handleStatusChange("pendiente")}
                className={`status-btn btn-pendiente ${
                  order.status === "pendiente" ? "active" : ""
                }`}
                disabled={order.status === "pendiente" || isLocked}
              >
                Pendiente
              </button>
              <button
                onClick={() => handleStatusChange("procesando")}
                className={`status-btn btn-procesando ${
                  order.status === "procesando" ? "active" : ""
                }`}
                disabled={order.status === "procesando" || isLocked}
              >
                Procesando
              </button>
              <button
                onClick={() => handleStatusChange("enviado")}
                className={`status-btn btn-enviado ${
                  order.status === "enviado" ? "active" : ""
                }`}
                disabled={order.status === "enviado" || isLocked}
              >
                Enviado
              </button>
              <button
                onClick={() => handleStatusChange("completado")}
                className={`status-btn btn-completado ${
                  order.status === "completado" ? "active" : ""
                }`}
                disabled={order.status === "completado" || isLocked}
              >
                Completado
              </button>
              <button
                onClick={() => handleStatusChange("cancelado")}
                className={`status-btn btn-cancelado ${
                  order.status === "cancelado" ? "active" : ""
                }`}
                disabled={order.status === "cancelado" || isLocked}
              >
                Cancelar
              </button>
            </div>

            {isLocked && (
              <p className="admin-notice">
                {isCompleted
                  ? "Este pedido ha sido completado y no puede modificarse."
                  : "Este pedido ha sido cancelado y no puede modificarse."}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn-close">
            Cerrar
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderTrackingModal;
