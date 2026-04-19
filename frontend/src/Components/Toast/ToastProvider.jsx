import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import "./Toast.css";

const ToastContext = createContext(null);

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const hideToast = useCallback(() => setToast(null), []);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(hideToast, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [toast, hideToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <div
          className={`toast-popup toast-popup--${toast.variant}`}
          role="status"
          aria-live="polite"
        >
          <span className="toast-popup__text">{toast.message}</span>
          <button
            type="button"
            className="toast-popup__close"
            onClick={hideToast}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
