import { useState } from "react";
import Modal from "./Modal";

const Table = ({ columns, data, onDesactivar, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [detalles, setDetalles] = useState({});

  const handleDetalles = (usuario) => {
    setDetalles(usuario);
    setIsOpen(true);
  };
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ textAlign: "center" }}
              >
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) =>
                  col === "opciones" ? (
                    <td
                      className="opcionesAdminUsuario"
                      key={colIndex}
                    >
                      <button
                        className="action-button ver"
                        onClick={() => handleDetalles(row)}
                      >
                        Ver detalles
                      </button>
                      <button
                        className="action-button eliminar"
                        onClick={() => onDesactivar(row.id)}
                      >
                        Eliminar
                      </button>
                      {onEdit && (
                        <button
                          className="action-button editar"
                          onClick={() => onEdit(row)}
                          style={{ backgroundColor: "#eab308", color: "white" }}
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  ) : (
                    <td key={colIndex}>{row[col]}</td>
                  ),
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`Detalles de ${detalles.nombre || ""}`}
        >
          <div className="modal-card">
            <div className="modal-header">
              {detalles.imagen && (
                <img src={detalles.imagen} className="modal-avatar" />
              )}
              <div className="modal-info">
                <h3>
                  {detalles.nombre} {detalles.apellido}
                </h3>
                <p>
                  <strong>Correo:</strong> {detalles.correo}
                </p>
                <p>
                  <strong>Dni:</strong> {detalles.dni}
                </p>
                <p>
                  <strong>Estado :</strong> {detalles.estado}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Table;
