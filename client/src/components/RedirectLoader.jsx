import React from "react";
import "../styles/animations.css";

export default function RedirectLoader({ message = "Redirigiendo..." }) {
  return (
    <div className="redirect-container">
      <div className="redirect-content">
        <div className="redirect-spinner"></div>
        <h2 className="redirect-text">{message}</h2>
      </div>
    </div>
  );
}
