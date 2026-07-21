import { useState } from "react";
import Modal from "../Modal";
import { getMaterialById } from "../../front-back/apiDocenteCursos";

export default function MaterialItem({
  titulo,
  descripcion,
  fecha,
  curso,
  id,
  urlVideo,
}) {
  const [showModal, setShowModal] = useState(false);
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = "https://classroom-production-6289.up.railway.app/";

  const handleModal = async () => {
    if (!showModal) {
      setShowModal(true);
      setLoading(true);
      setMaterial(null);

      try {
        const res = await getMaterialById(id);
        setMaterial(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setShowModal(false);
    }
  };
  const handleMaterial = () => {
    if (urlVideo) {
      window.open(urlVideo, "_blank");
    }
  };

  return (
    <div className="material-item">
      <div className="material-info">
        <p>
          <strong>
            <em>{titulo}</em>
          </strong>
        </p>
        <p>
          <em>{descripcion}</em>
        </p>
      </div>
      <div className="material-meta">
        <p>
          <strong>Fecha:</strong> {fecha}
        </p>
        <p>
          <strong>Curso:</strong> {curso}
        </p>
      </div>
      <div className="material-button">
        <button onClick={handleModal}>Ver material</button>
        <button onClick={handleMaterial}>Ver apartado</button>
      </div>
      <Modal isOpen={showModal} onClose={handleModal} title={titulo}>
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Cargando material...</p>
          </div>
        ) : material ? (
          <iframe
            src={material.pdf?.startsWith("http") ? material.pdf : `${BACKEND_URL}${material.pdf}`}
            title={titulo}
            width="100%"
            height="500px"
            style={{ border: "none" }}
          />
        ) : null}
      </Modal>
    </div>
  );
}
