import { useEffect, useState } from "react";
import "../../styles/docente/juegos.css";
import useAuth from "../../context/useAuth";
import { getListCursosDocente, generarReporteCursoData } from "../../front-back/apiDocenteCursos";
import Modal from "../../components/Modal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
// import Toast from "../../components/Toast";

export default function Juegos() {
  const { user } = useAuth();
  const id = user?.id;
  const [misCursos, setMisCursos] = useState([]);
  const [OpenModal, setOpenModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [tipoReporte, setTipoReporte] = useState("general");
  const [periodo, setPeriodo] = useState("mensual");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const dataCursos = async (id) => {
    const res = await getListCursosDocente(id);
    setMisCursos(res);
  };
  const handleClickId = (idCurso) => {
    console.log(idCurso);
    setCursoSeleccionado(idCurso);
    setOpenModal(true);
  };

  const handleGenerarReporte = async (e) => {
    e.preventDefault();
    if (!cursoSeleccionado) return;

    setIsGenerating(true);
    try {
      const resp = await generarReporteCursoData({
        cursoId: cursoSeleccionado,
        tipoReporte,
        periodo,
        fechaSeleccionada
      });
      console.log(resp);

      if (resp.error) {
        alert(resp.error);
        setIsGenerating(false);
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(`Reporte de Curso: ${resp.curso}`, 14, 20);
      doc.setFontSize(14);
      doc.text(`Grado: ${resp.grado}`, 14, 30);
      doc.text(`Tipo de Reporte: ${tipoReporte.toUpperCase()}`, 14, 40);
      doc.text("Tipo de discapacidad: TDAH", 14, 50)
      let periodoLabel = periodo === 'todo' ? 'Historico Completo' : periodo.charAt(0).toUpperCase() + periodo.slice(1);
      if (periodo !== 'todo' && fechaSeleccionada) {
        periodoLabel += ` (${fechaSeleccionada})`;
      }
      doc.text(`Periodo: ${periodoLabel}`, 14, 60);
      doc.text(`Fecha de Emision: ${new Date().toLocaleDateString()}`, 14, 70);

      resp.grupos.forEach((grupo, index) => {
        if (index > 0) doc.addPage();
        doc.setFontSize(16);
        doc.text(grupo.titulo, 14, index === 0 ? 80 : 20);

        let head = [];
        let body = [];

        if (tipoReporte === "general") {
          head = [["Alumno", "Participaciones", "Asistencia (%)"]];
          body = grupo.alumnos.map(a => [
            `${a.apellido}, ${a.nombre}`,
            Number(a.promedio_notas),
            Number(a.porcentaje_asistencia) + "%"
          ]);
        } else if (tipoReporte === "notas") {
          head = [["Alumno", "Participaciones"]];
          body = grupo.alumnos.map(a => [
            `${a.apellido}, ${a.nombre}`,
            Number(a.promedio_notas)
          ]);
        } else if (tipoReporte === "asistencia") {
          head = [["Alumno", "Asistencia (%)"]];
          body = grupo.alumnos.map(a => [
            `${a.apellido}, ${a.nombre}`,
            Number(a.porcentaje_asistencia) + "%"
          ]);
        }

        autoTable(doc, {
          startY: index === 0 ? 90 : 30,
          head: head,
          body: body,
        });
      });

      doc.save(`Reporte_Curso_${resp.curso.replace(/\s+/g, '_')}_${tipoReporte}.pdf`);
      setOpenModal(false);
    } catch (error) {
      console.error("Error generando reporte:", error);
      alert("Error al generar el reporte");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (id) {
      dataCursos(id);
    }
  }, [id]);

  return (
    <div className="juegos-container">
      <div className="titulo">Seccion de reportes</div>
      <div className="contenedorCursosReporte">
        {misCursos.map((curso) => (
          <div
            className="cursoCard2"
            key={curso.id}
            onClick={() => handleClickId(curso.id)}
          >
            <div className="informacionCurso">
              <h2>{curso.nombre}</h2>
              {/* <p>{curso.descripcion}</p> */}
              <img src={curso.imagenUrl} alt="" />
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={OpenModal}
        onClose={() => setOpenModal(false)}
        title="Generar Reporte"
      >
        <div className="bodyModalReporte" style={{ padding: "15px" }}>
          <form onSubmit={handleGenerarReporte} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label htmlFor="tipoReporte" style={{ fontWeight: "bold" }}>Tipo de Reporte:</label>
              <select
                id="tipoReporte"
                value={tipoReporte}
                onChange={(e) => setTipoReporte(e.target.value)}
                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" }}
              >
                <option value="general">General (Notas y Asistencia)</option>
                <option value="notas">Solo Notas</option>
                <option value="asistencia">Solo Asistencia</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label htmlFor="periodo" style={{ fontWeight: "bold" }}>Período:</label>
              <select
                id="periodo"
                value={periodo}
                onChange={(e) => {
                  setPeriodo(e.target.value);
                  setFechaSeleccionada("");
                }}
                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" }}
              >
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
                <option value="todo">Historial Completo</option>
              </select>
            </div>
            {periodo !== "todo" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label htmlFor="fechaSeleccionada" style={{ fontWeight: "bold" }}>Seleccionar Fecha:</label>
                <input
                  type={periodo === "diario" ? "date" : periodo === "semanal" ? "week" : "month"}
                  id="fechaSeleccionada"
                  value={fechaSeleccionada}
                  onChange={(e) => setFechaSeleccionada(e.target.value)}
                  style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" }}
                  required
                />
              </div>
            )}
            <button
              type="submit"
              disabled={isGenerating}
              style={{
                padding: "12px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: isGenerating ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                transition: "background-color 0.3s"
              }}
            >
              {isGenerating ? "Generando Reporte..." : "Descargar PDF"}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
