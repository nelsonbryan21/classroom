import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/docente/dashboard.css";
import { getDashboardStats } from "../../front-back/apiDocenteCursos";
import {
  FaUserGraduate,
  FaCalendarTimes,
  FaSchool,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
);

const DashboardDocente = () => {
  const [datos, setDatos] = useState({
    cursos: 0,
    alumnos: 0,
    clasesHoy: 0,
  });

  const [asistenciaData, setAsistenciaData] = useState({
    labels: [],
    datasets: [],
  });

  // const [notasData, setNotasData] = useState({
  //   labels: [],
  //   datasets: [],
  // });

  const [alumnosClase, setAlumnosClase] = useState({
    labels: [],
    datasets: [],
  });
  const [alumnosCurso, setAlumnosCurso] = useState({
    labels: [],
    datasets: [],
  });


  const generarPDF = () => {
    const doc = new jsPDF();

    doc.text("Reporte de Asistencia del Alumnado", 14, 15);

    const tableColumn = ["Nombre", "Apellido", "Grado", "Curso"];
    const tableRows = [];

    alumnosCurso.forEach((fila) => {

      tableRows.push([fila.nombre, fila.apellido, fila.grado, fila.curso]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("reporte.pdf");
  };

  useEffect(() => {
    const fetchData = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      try {
        const stats = await getDashboardStats(user.id);
        setDatos({
          cursos: stats.cursos,
          alumnos: stats.alumnos,
          clasesHoy: stats.clasesHoy,
        });

        setAsistenciaData({
          labels: stats.asistencia.map((a) => a.nombre),
          datasets: [
            {
              label: "Asistencia promedio (%)",
              data: stats.asistencia.map((a) => a.promedio),
              backgroundColor: ["#4A90E2", "#50E3C2", "#F5A623", "#D0021B", "#9013FE", "#F8E71C", "#8B572A"],
              borderRadius: 5,
            },
          ],
        });

        // setNotasData({
        //   labels: stats.notas.map((n) => n.nombre),
        //   datasets: [
        //     {
        //       label: "Promedio de notas",
        //       data: stats.notas.map((n) => n.promedio),
        //       backgroundColor: "#f39c12",
        //       borderRadius: 5,
        //     },
        //   ],
        // });
        setAlumnosClase({
          labels: stats.alumnosCount.map((a) => a.nombre),
          datasets: [
            {
              label: "Alumnos por curso",
              data: stats.alumnosCount.map((a) => a.alumnos),
              backgroundColor: ["#50E3C2", "#F5A623", "#D0021B", "#9013FE", "#F8E71C", "#8B572A", "#4A90E2"],
              borderRadius: 5,
            },
          ],
        });

        setAlumnosCurso(stats.alumnosData);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };

    fetchData();
  }, []);



  return (
    <div className="dashboard-docente">
      <h1>Panel del Docente </h1>
      <div className="docente-cards">
        <div className="docente-card">
          <div>
            <FaSchool />
          </div>
          <h3>Cursos asignados</h3>
          <p>{datos.cursos}</p>
        </div>
        <div
          className="docente-card TotalAlumnosDescargar"
          onClick={() => generarPDF()}
        >
          <div >
            {" "}
            <FaUserGraduate />
          </div>
          <h3>Total de alumnos</h3>
          <p>{datos.alumnos}</p>
        </div>
        {/* <div className="docente-card">
          <div>
            <FaCalendarTimes />
          </div>
          <h3>Clases hoy</h3>
          <p>{datos.clasesHoy}</p>
        </div> */}
      </div>

      <div className="graficos">
        <div className="docente-chart">
          <h2>Asistencia Promedio por Curso</h2>
          {asistenciaData.labels.length > 0 ? (
            <Bar data={asistenciaData} />
          ) : (
            <p>No hay datos de asistencia aún.</p>
          )}
        </div>
        {/* <div className="docente-chart">
          <h2> Promedio de notas por Curso</h2>
          {notasData.labels.length > 0 ? (
            <Bar data={notasData} />
          ) : (
            <p>No hay datos de notas aún.</p>
          )}
        </div> */}
        <div className="docente-chart">
          <h2> Cantidad de alumnos por Curso</h2>
          {alumnosClase.labels.length > 0 ? (
            <Bar data={alumnosClase} />
          ) : (
            <p>No hay datos de notas aún.</p>
          )}
        </div>
        {/* <div className="docente-chart">
          <h2> Cantidad de participaciones por Curso</h2>
          {alumnosClase.labels.length > 0 ? (
            <Bar data={alumnosClase} />
          ) : (
            <p>No hay datos de notas aún.</p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default DashboardDocente;
