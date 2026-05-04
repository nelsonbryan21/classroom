import { useEffect, useState } from "react";
import {
  getListCursosDocente,
  insertAlumnoCurso,
  listAlumnosCursos,
  getFechasAsistencia,
  getAsistenciaFecha,
  updateAlumno,
} from "../../front-back/apiDocenteCursos";
import "../../styles/docente/misCursos.css";
import "../../App.css";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";
import ModalAsistencia from "../../components/docente/ModalAsistencia";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useAuth from "../../context/useAuth";
import TablaAlumnos from "../../components/docente/TablaAlumnos";

export default function MisCursos() {
  const [misCursos, setMisCursos] = useState([]);
  const [idCurso, setIdCurso] = useState("");
  const [discapacidad, setDiscapacidad] = useState("TDAH");
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [apellidoAlumno, setApellidoAlumno] = useState("");
  const [isEditingAlumno, setIsEditingAlumno] = useState(false);
  const [editAlumnoId, setEditAlumnoId] = useState(null);
  const [isOpenAgregar, setIsOpenAgregar] = useState(false);
  const [isOpenAsistencia, setIsOpenAsistencia] = useState(false);
  const [isOpenDetalles, setIsOpenDetalles] = useState(false);
  const [isOpenAdminAlumnos, setIsOpenAdminAlumnos] = useState(false);
  const [notification, setNotification] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [nombreCurso, setNombreCurso] = useState("");
  const [alumnos, setAlumnos] = useState([]);

  // Calendar State
  const [fechasAsistencia, setFechasAsistencia] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date(),
  );
  const [listaAsistenciaDia, setListaAsistenciaDia] = useState(null);

  const { user } = useAuth();
  const id = user?.id;

  const dataCursos = async (id) => {
    const res = await getListCursosDocente(id);
    setMisCursos(res);
  };

  const handleCloseAgregar = () => {
    setPreview(null);
    setIsOpenAgregar(false);
    setIsEditingAlumno(false);
    setEditAlumnoId(null);
    setNombreAlumno("");
    setApellidoAlumno("");
    setFile(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleAgregarAlumno = (id) => {
    setIdCurso(id);
    setIsEditingAlumno(false);
    setEditAlumnoId(null);
    setNombreAlumno("");
    setApellidoAlumno("");
    setFile(null);
    setPreview(null);
    setIsOpenAgregar(true);
  };

  const handleEditAlumno = (alumno) => {
    setIsEditingAlumno(true);
    setEditAlumnoId(alumno.id);
    setNombreAlumno(alumno.nombre);
    setApellidoAlumno(alumno.apellido);
    setPreview(alumno.imagenUrl || null);
    setFile(null);
    setIsOpenAgregar(true);
  };

  const handleAsistencia = async (nombre, idCurso) => {
    setNombreCurso(nombre);
    setIdCurso(idCurso);
    const response = await listAlumnosCursos(idCurso);
    setAlumnos(response);
    setIsOpenAsistencia(true);
  };

  const handleVerDetalles = async (cursoId) => {
    setIdCurso(cursoId);
    setFechasAsistencia([]);
    setListaAsistenciaDia(null);
    try {
      const fechas = await getFechasAsistencia(cursoId);

      setFechasAsistencia(fechas || []);
      setIsOpenDetalles(true);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar el historial", "error");
    }
  };

  const onDateChange = async (date) => {
    setFechaSeleccionada(date);

    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    );
    const dateString = offsetDate.toISOString().split("T")[0];

    if (fechasAsistencia.includes(dateString)) {
      try {
        const detalles = await getAsistenciaFecha(
          idCurso,
          dateString,
        );
        setListaAsistenciaDia(detalles);
      } catch (e) {
        console.error(e);
      }
    } else {
      setListaAsistenciaDia(null);
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const offsetDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
      );
      const dateString = offsetDate.toISOString().split("T")[0];
      if (fechasAsistencia.includes(dateString)) {
        return "highlight-attendance";
      }
    }
  };

  const hanldleSubmit = async () => {
    const formData = new FormData();

    formData.append("discapacidad", discapacidad);
    formData.append("nombre", nombreAlumno);
    formData.append("apellido", apellidoAlumno);
    formData.append("image", file);
    formData.append("curso", idCurso);
    try {
      let response;
      if (isEditingAlumno) {
        response = await updateAlumno(editAlumnoId, formData);
        if (isOpenAdminAlumnos) {
          const resAlumnos = await listAlumnosCursos(idCurso);
          setAlumnos(resAlumnos);
        }
      } else {
        response = await insertAlumnoCurso(formData);
      }

      if (response.error) {
        setNotification(response.error);
      }
      setNotification("Alumno agregado exitosamente");
      setPreview(null);
      setIsOpenAgregar(false);
      setIdCurso(null);
      setFile(null);
      setDiscapacidad("TDAH");
      setNombreAlumno("");
      setApellidoAlumno("");
      setIsEditingAlumno(false);
      setEditAlumnoId(null);
    } catch (error) {
      console.log(error);
      setNotification("Error al agregar alumno");
    }
  };

  const handleAdminAlumnos = async (id) => {
    const response = await listAlumnosCursos(id);
    setAlumnos(response);
    setIdCurso(id);
    setIsOpenAdminAlumnos(true);
  };

  useEffect(() => {
    if (id) {
      dataCursos(id);
    }
  }, [id]);

  useEffect(() => {
    if (notification) {
      Swal.fire({
        title: notification,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    setNotification("");
  }, [notification]);

  return (
    <div className="misCursos">
      <style>{`
            .highlight-attendance {
                background: #28a745 !important;
                color: white !important;
                border-radius: 50%;
            }
            .react-calendar {
                width: 100%;
                border: none;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                border-radius: 8px;
            }
        `}</style>
      <h2>Cursos asignados</h2>
      <div className="containerCursosDocente">
        {misCursos.map((curso) => (
          <div className="cursoCard" key={curso.id}>
            <div className="informacionCurso">
              <h2>{curso.nombre}</h2>
              {/* <p>{curso.descripcion}</p> */}
              <img src={curso.imagenUrl} alt="" />
            </div>

            <div className="botonesCurso">
              <button onClick={() => handleAgregarAlumno(curso.id)}>
                Agregar alumnos
              </button>
              <button
                onClick={() =>
                  handleAsistencia(curso.nombre, curso.id)
                }
              >
                Asistencia
              </button>
              <button onClick={() => handleVerDetalles(curso.id)}>
                Ver Historial Asistencia
              </button>
              <button onClick={() => handleAdminAlumnos(curso.id)}>
                Administrar Alumnos
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* modal administrar alumnos */}
      <Modal
        isOpen={isOpenAdminAlumnos}
        onClose={() => {
          setIsOpenAdminAlumnos(false);
        }}
        title="Administracion de alumnos"
      >
        <div
          className="containerDetallesCurso"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <TablaAlumnos alumnos={alumnos} setAlumnos={setAlumnos} onEdit={handleEditAlumno} />
        </div>
      </Modal>

      {/* modal agregar alumnos */}
      <Modal
        isOpen={isOpenAgregar}
        onClose={() => {
          handleCloseAgregar();
        }}
        title={isEditingAlumno ? "Editar alumno" : "Agregar alumnos"}
        className="modalAgregarAlumnos"
      >
        <form action="" className="agregarEstudiante">
          <div className="informacionEstudiante">
            <div className="form-class">
              <label htmlFor="">Ingresa el nombre del alumno</label>
              <input
                type="text"
                placeholder="Ingresa el nombre"
                required
                value={nombreAlumno}
                onChange={(e) => setNombreAlumno(e.target.value)}
              />
            </div>
            <div className="form-class">
              <label htmlFor="">Ingresa el apellido del alumno</label>
              <input
                type="text"
                placeholder="Ingresa el apellido"
                required
                value={apellidoAlumno}
                onChange={(e) => setApellidoAlumno(e.target.value)}
              />
            </div>
            {/* <div className="form-class">
              <label htmlFor="discapacidad">
                Seleccione la discapacidad:
              </label>
              <select
                id="discapacidad"
                name="discapacidad"
                required
                onChange={(e) => setDiscapacidad(e.target.value)}
              >
                <option value="">Elige una discapacidad</option>
                <option value="TDAH">TDAH</option>
                <option value="Trisomia 21">Trisomia 21</option>
              </select>
            </div> */}
          </div>
          <div className="imagenEstudiante">
            <label htmlFor="imagen">Selecciona una imagen:</label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              required={!isEditingAlumno}
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="previewImage">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="imagenPreview"
                />
              ) : (
                <p>No se ha seleccionado ninguna imagen.</p>
              )}
            </div>
          </div>
        </form>
        <button
          type="button"
          className="botonAgregar"
          onClick={() => hanldleSubmit()}
        >
          {isEditingAlumno ? "Actualizar" : "Agregar"}
        </button>
      </Modal>

      {/* modal asistencia */}
      <ModalAsistencia
        isOpen={isOpenAsistencia}
        onClose={() => setIsOpenAsistencia(false)}
        nombreCurso={nombreCurso}
        alumnos={alumnos}
        idCurso={idCurso}
      />

      {/* modal detalles del curso (Calendario) */}
      <Modal
        isOpen={isOpenDetalles}
        onClose={() => {
          setIsOpenDetalles(false);
          setListaAsistenciaDia(null);
        }}
        title="Historial de Asistencia"
      >
        <div
          className="containerDetallesCurso"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Calendar
              onChange={onDateChange}
              value={fechaSeleccionada}
              tileClassName={tileClassName}
            />
          </div>
          <div>
            <h3 className="detalle-fecha">
              Detalle Asistencia:{" "}
              {fechaSeleccionada.toLocaleDateString()}
            </h3>
            {listaAsistenciaDia ? (
              <table
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Alumno</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {listaAsistenciaDia.map((a, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: "8px" }}>
                        {a.nombre} {a.apellido}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          color: a.presente ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {a.presente ? "Presente" : "Ausente"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>
                Selecciona un día marcado en verde para ver la lista.
              </p>
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
}
