import "../../styles/director.css";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/director/dashboard.css";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
} from "react-icons/fa";
import { getDataDashboard } from "../../front-back/apiDirector";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const { id } = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);

  // const stats = {
  //   alumnos: 150,
  //   docentes: 12,
  //   cursos: 8,
  // };
  const cards = [
    {
      titulo: "Alumnos",
      cantidad: data.alumnos,
      icon: <FaUserGraduate />,
    },
    {
      titulo: "Docentes",
      cantidad: data.docentes,
      icon: <FaChalkboardTeacher />,
    },
    {
      titulo: "Cursos",
      cantidad: data.cursos,
      icon: <FaSchool />,
    },
    {
      titulo: "Plan de trabajo",
      cantidad: data.planTrabajo,
      icon: <FaUserGraduate />,
    }
  ];

  const loadData = async () => {
    const response = await getDataDashboard();
    setData(response);
  };

  const chartData = {
    labels: ["Alumnos", "Docentes", "Cursos", "Planes de Trabajo"],
    datasets: [
      {
        label: "Cantidad Total",
        data: [data.alumnos || 0, data.docentes || 0, data.cursos || 0, data.planTrabajo || 0],
        backgroundColor: ["#4A90E2", "#50E3C2", "#F5A623", "#D0021B"],
        borderRadius: 5,
      },
    ],
  };

  useEffect(() => {
    loadData();
  }, [id]);
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Panel del Director</h1>
      <p className="dashboard-subtitle">Datos del sistema de gestion escolar</p>

      <div className="dashboard-cards">
        {cards.map((item, index) => (
          <div className="card" key={index}>
            <div className="card-icon">{item.icon}</div>
            <h4>{item.titulo}</h4>
            <p>{item.cantidad}</p>
          </div>
        ))}

      </div>

      <div className="graficos" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div className="dashboard-chart" style={{ width: "80%", maxWidth: "800px" }}>
          <h2>Resumen de la Plataforma</h2>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
