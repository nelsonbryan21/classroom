import React, { useEffect, useState } from "react";
import "../styles/animations.css";

export default function SplashLogin({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000); // Wait 2 seconds before fading out
    
    const removeTimer = setTimeout(() => {
      onFinish();
    }, 2500); // Total 2.5s before unmounting

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-container ${fadeOut ? "fade-out" : ""}`}>
      <div className="splash-content">
        <div className="splash-logo-container">
          <img src="/login.png" alt="Logo" className="splash-logo" />
        </div>
        <h1 className="splash-title">Plataforma Estudiantil</h1>
        <div className="splash-loader"></div>
      </div>
    </div>
  );
}
