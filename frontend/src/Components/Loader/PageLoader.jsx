import React from "react";
import "./PageLoader.css";

/**
 * Site-wide loading UI (Chronic accent). Use fullScreen for route/auth gates;
 * use default (section) inside page content.
 */
function PageLoader({
  message = "Loading",
  fullScreen = false,
  className = "",
}) {
  return (
    <div
      className={`page-loader ${fullScreen ? "page-loader--fullscreen" : "page-loader--section"} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="page-loader__inner">
        <span className="page-loader__spinner" aria-hidden />
        <span className="page-loader__text">{message}</span>
      </div>
    </div>
  );
}

export default PageLoader;
