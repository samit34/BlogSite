import React from "react";
import "./EmptyState.css";

/**
 * Friendly empty list / no-results UI (Chronic styling).
 */
function EmptyState({ title, hint, className = "" }) {
  return (
    <div
      className={`empty-state ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <p className="empty-state__title">{title}</p>
      {hint ? <p className="empty-state__hint">{hint}</p> : null}
    </div>
  );
}

export default EmptyState;
