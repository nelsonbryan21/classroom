// Sidebar.jsx
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "../styles/general.css";
import useAuth from "../context/useAuth";
import {
  FaTachometerAlt,
  FaBook,
  FaUpload,
  FaQuestionCircle,
  FaClipboardCheck,
  FaCalendarAlt,
  FaGamepad,
  FaUsers,
  FaFileAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
const menuItems = {
  docente: [

    { path: "/mis-cursos", label: "Mis Cursos", icon: <FaBook /> },
    {
      path: "/subir-material",
      label: "Subir material",
      icon: <FaUpload />,
    },
    // {
    //   path: "/formular-preguntas",
    //   label: "Formular Preguntas",
    //   icon: <FaQuestionCircle />,
    // },
    {
      path: "/calificar-alumnos",
      label: "Calificar Alumnos",
      icon: <FaClipboardCheck />,
    },
    {
      path: "/plan-trabajo",
      label: "Semanario para el director",
      icon: <FaCalendarAlt />,
    },
    {
      path: "/juegos",
      label: "Generar Reportes",
      icon: <FaFileAlt />,
    },
    {
      path: "/dashboardDocente",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
    },
  ],
  director: [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      path: "/gestionUsuarios",
      label: "Gestión de Docentes",
      icon: <FaUsers />,
    },
    { path: "/cursos", label: "Cursos", icon: <FaBook /> },
    {
      path: "/planTrabajoVer",
      label: "Plan de trabajo",
      icon: <FaCalendarAlt />,
    },
    { path: "/reportes", label: "Reportes", icon: <FaFileAlt /> },
    { path: "/perfil-director", label: "Perfil", icon: <FaUser /> },
  ],
};

export default function Sidebar({ role }) {
  const items = menuItems[role] || [];
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div className="sidebarBox">
      <div className="sidebarTitle">
        <img src="/logo.png" alt="" />
      </div>
      <ul className="sidebarList">
        {items.map((item, idx) => (
          <li key={idx}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebarLink active" : "sidebarLink"
              }
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="sidebarFooter">
        <Link to="/login" className="logoutButton">
          <button
            className="cerrarSesion"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            Cerrar sesión
          </button>
        </Link>
      </div>
    </div>
  );
}
