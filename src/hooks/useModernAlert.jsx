import { useState, useCallback } from "react";
import ModernAlert from "../components/ModernAlert";

export const useModernAlert = () => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "Aceptar",
    cancelText: "Cancelar",
    showCancel: false,
    onConfirm: null,
    confirmColor: null,
    cancelColor: null,
  });

  const showAlert = useCallback((options) => {
    return new Promise((resolve) => {
      setAlertState({
        isOpen: true,
        type: options.type || "info",
        title: options.title || "",
        message: options.message || options.text || "",
        confirmText: options.confirmText || "Aceptar",
        cancelText: options.cancelText || "Cancelar",
        showCancel: options.showCancel || false,
        confirmColor: options.confirmColor,
        cancelColor: options.cancelColor,
        onConfirm: () => {
          resolve({ isConfirmed: true });
          setAlertState((prev) => ({ ...prev, isOpen: false }));
        },
        onCancel: () => {
          resolve({ isConfirmed: false });
          setAlertState((prev) => ({ ...prev, isOpen: false }));
        },
      });
    });
  }, []);

  const closeAlert = useCallback(() => {
    if (alertState.onCancel) {
      alertState.onCancel();
    } else {
      setAlertState((prev) => ({ ...prev, isOpen: false }));
    }
  }, [alertState]);

  const fire = useCallback(
    (titleOrOptions, text, type) => {
      if (typeof titleOrOptions === "object") {
        return showAlert(titleOrOptions);
      }
      return showAlert({
        title: titleOrOptions,
        message: text,
        type: type,
      });
    },
    [showAlert]
  );

  const success = useCallback(
    (title, message) => {
      return showAlert({ type: "success", title, message });
    },
    [showAlert]
  );

  const error = useCallback(
    (title, message) => {
      return showAlert({ type: "error", title, message });
    },
    [showAlert]
  );

  const warning = useCallback(
    (title, message) => {
      return showAlert({ type: "warning", title, message });
    },
    [showAlert]
  );

  const info = useCallback(
    (title, message) => {
      return showAlert({ type: "info", title, message });
    },
    [showAlert]
  );

  const confirm = useCallback(
    (title, message) => {
      return showAlert({
        type: "question",
        title,
        message,
        showCancel: true,
      });
    },
    [showAlert]
  );

  const AlertComponent = (
    <ModernAlert
      isOpen={alertState.isOpen}
      onClose={closeAlert}
      onConfirm={alertState.onConfirm}
      type={alertState.type}
      title={alertState.title}
      message={alertState.message}
      confirmText={alertState.confirmText}
      cancelText={alertState.cancelText}
      showCancel={alertState.showCancel}
      confirmColor={alertState.confirmColor}
      cancelColor={alertState.cancelColor}
    />
  );

  return {
    alert: AlertComponent,
    showAlert,
    fire,
    success,
    error,
    warning,
    info,
    confirm,
  };
};

export default useModernAlert;
