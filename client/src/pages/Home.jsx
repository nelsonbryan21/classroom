import { useNavigate } from "react-router-dom";
import "../styles/not-found.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <div className="not-found-glow" aria-hidden="true" />
      <section className="not-found-content" aria-labelledby="not-found-title">
        <p className="not-found-code">404</p>
        <p className="not-found-eyebrow">Página no encontrada</p>
        <h1 id="not-found-title">Este camino no lleva a ningún curso.</h1>
        <p className="not-found-description">
          La dirección que buscas no existe o ya no está disponible. Regresa al
          inicio para continuar desde allí.
        </p>
        <button className="not-found-button" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </section>
      <span className="not-found-mark" aria-hidden="true">/</span>
      <span className="not-found-dot not-found-dot-one" aria-hidden="true" />
      <span className="not-found-dot not-found-dot-two" aria-hidden="true" />
    </main>
  );
}
