import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { createReview, checkOrderReview } from "../utils/api.js";
import "../App.css";

const OrderTrackingModal = ({
  order,
  onClose,
  isAdmin = false,
  onUpdateStatus,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (order.status === "completado" && !isAdmin && !order.hasReview) {
      setShowReviewForm(true);
    }
  }, [order.status, isAdmin, order.hasReview]);

  useEffect(() => {
    const verifyReview = async () => {
      try {
        if (order?.id && order.status === "completado" && !isAdmin) {
          const response = await checkOrderReview(order.id);

          if (response.hasReview) {
            setShowReviewForm(false);
            setReviewSubmitted(true);
            order.hasReview = true;
            if (response.review) {
              setUserReview(response.review);
            }
          } else {
            setShowReviewForm(true);
          }
        }
      } catch (error) {
        console.error("Error al verificar reseña:", error);
      }
    };

    verifyReview();
  }, [order.id, order.status, isAdmin]);

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
    if (isCompleted) return "step-completed";
    if (stepId < currentStep) return "step-completed";
    if (stepId === currentStep) return "step-active";
    return "step-pending";
  };

  const handleStatusChange = (newStatus) => {
    if (onUpdateStatus && !isLocked) {
      onUpdateStatus(order.id, newStatus);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      Swal.fire(
        "Advertencia",
        "Por favor selecciona una calificación",
        "warning"
      );
      return;
    }
    if (comment.trim().length < 10) {
      Swal.fire(
        "Advertencia",
        "Por favor escribe un comentario de al menos 10 caracteres",
        "warning"
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await createReview({
        orderId: order.id,
        rating,
        comment: comment.trim(),
      });
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "¡Gracias por tu reseña!",
          text: "Tu opinión nos ayuda a mejorar cada día.",
          confirmButtonText: "Aceptar",
        });

        setReviewSubmitted(true);
        setShowReviewForm(false);
        order.hasReview = true;
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        Swal.fire("Error", "No se pudo enviar la reseña", "error");
        throw new Error(response.error || "Error al enviar reseña");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error al enviar reseña",
        text: "Hubo un problema al enviar tu opinión. Intenta de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
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
        <div className="modal-header-order">
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
          ) : isCompleted && reviewSubmitted ? (
            <div className="review-success-notice">
              <div className="success-icon">
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
              <h3 className="success-title">¡Gracias por tu reseña!</h3>
              <p className="success-description">
                Tu opinión nos ayuda a mejorar cada día. ¡Esperamos verte
                pronto!
              </p>
              {reviewSubmitted && userReview && (
                <div className="user-review-display">
                  <h4 className="user-review-title">Tu reseña:</h4>
                  <div className="user-review-stars">
                    {[...Array(userReview.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="star"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="user-review-comment">“{userReview.comment}”</p>
                </div>
              )}
            </div>
          ) : isCompleted && !showReviewForm ? (
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
                const isStepCompleted = isCompleted || step.id < currentStep;
                const isActive = !isCompleted && step.id === currentStep;

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

        {/* Formulario de reseña */}
        {showReviewForm && !isAdmin && !reviewSubmitted && (
          <div className="review-form-container">
            <div className="review-form-header">
              <h3 className="review-form-title">¿Cómo fue tu experiencia?</h3>
              <p className="review-form-subtitle">
                Tu opinión es muy importante para nosotros
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="rating-container">
                <label className="rating-label">Calificación</label>
                <div className="rating">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <React.Fragment key={star}>
                      <input
                        type="radio"
                        id={`star-${star}`}
                        name="star-radio"
                        value={star}
                        checked={rating === star}
                        onChange={() => setRating(star)}
                      />
                      <label
                        htmlFor={`star-${star}`}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            pathLength="360"
                            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                          />
                        </svg>
                      </label>
                    </React.Fragment>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="rating-text">
                    {rating === 5 && "¡Excelente!"}
                    {rating === 4 && "Muy bueno"}
                    {rating === 3 && "Bueno"}
                    {rating === 2 && "Regular"}
                    {rating === 1 && "Malo"}
                  </p>
                )}
              </div>

              <div className="comment-container">
                <label htmlFor="review-comment" className="comment-label">
                  Cuéntanos tu experiencia
                </label>
                <textarea
                  id="review-comment"
                  className="comment-textarea"
                  placeholder="Comparte tu opinión sobre el producto, servicio, entrega..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  maxLength="100"
                  required
                />
                <span className="comment-counter">
                  {comment.length}/100 caracteres
                </span>
              </div>

              <div className="review-form-actions">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="btn-skip-review"
                  disabled={isSubmitting}
                >
                  Más tarde
                </button>
                <button
                  type="submit"
                  className="btn-submit-review"
                  disabled={isSubmitting || rating === 0}
                >
                  {isSubmitting ? "Enviando..." : "Enviar reseña"}
                </button>
              </div>
            </form>
          </div>
        )}

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
