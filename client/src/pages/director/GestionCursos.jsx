import { useEffect, useState } from "react";
import "../../styles/director/gestionCursos.css";
import Modal from "../../components/Modal";
import {
  getListCursos,
  getListDocentes,
  insertCurso,
} from "../../front-back/apiDirector";
import Swal from "sweetalert2";

export default function GestionCursos() {
  const [cursos, setCursos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCursos, setOpenModalCursos] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [nombreCurso, setNombreCurso] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [docente, setDocente] = useState("");
  const [grado, setGrado] = useState("");
  const [imagen, setImagen] = useState(null);

  const dataDocentes = async () => {
    const res = await getListDocentes();
    setDocentes(res);
  };

  const dataCursos = async () => {
    const res = await getListCursos();
    setCursos(res);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombreCurso);
    formData.append("descripcion", descripcion);
    formData.append("docente", docente);
    formData.append("grado", grado);
    formData.append("image", imagen);

    const response = await insertCurso(formData);

    if (response.success) {
      dataCursos();
      setOpenModal(false);
      Swal.fire({
        title: "Curso creado exitosamente",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    dataDocentes();
    dataCursos();
  }, []);

  return (
    <div>
      <div className="addCurso">
        <p>Presiona el boton para agregar un nuevo curso</p>
        <button
          className="buttonAddCurso"
          onClick={() => setOpenModal(true)}
        >
          Agregar Curso
        </button>
        {/* <Modal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title={"Agregar Curso"}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-class">
              <label htmlFor="curso">
                Ingrese el nombre del curso:
              </label>
              <input
                type="text"
                name="curso"
                onChange={(e) => setNombreCurso(e.target.value)}
                required
              />
            </div>
            <div className="form-class">
              <label htmlFor="description">
                Ingrese una breve descripcion del curso:
              </label>
              <textarea
                id="description"
                name="description"
                required
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>
            </div>
            <div className="form-class">
              <label>Seleccione el docente a cargo:</label>
              <select
                name="docente"
                required
                onClick={(e) => setDocente(e.target.value)}
              >
                <option value="">Seleccione una opcion</option>
                {docentes.map((docente) => (
                  <option key={docente.id} value={docente.id}>
                    {docente.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-class">
              <label>Seleccione el grado del curso:</label>
              <select
                name="grado"
                required
                onClick={(e) => setGrado(e.target.value)}
              >
                <option value="">Seleccione una opcion</option>
                <option value="5to grado">5to grado</option>
                <option value="6to grado">6to grado</option>
              </select>
            </div>
            <div className="form-class">
              <label htmlFor="imagen">Ingresa una imagen:</label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
              />
            </div>

            <button type="submit">Agregar</button>
          </form>
        </Modal> */}
        <Modal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title={"Agregar Curso"}
        >
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-grid">
              <div className="form-class form-group">
                <label className="form-label">Nombre del curso</label>
                <select
                  name="curso"
                  className="form-select"
                  required
                  onChange={(e) => setNombreCurso(e.target.value)}
                >
                  <option value="">Seleccione un curso</option>
                  <option value="matematica">Matemáticas</option>
                  <option value="comunicacion">Comunicación</option>
                  <option value="ciencia y ambiente">Ciencia y Ambiente</option>
                  <option value="personal social">Personal Social</option>
                  <option value="motricidad">Motricidad</option>
                </select>
              </div>

              <div className="form-class form-group">
                <label className="form-label">Docente</label>
                <select
                  name="docente"
                  className="form-select"
                  required
                  onChange={(e) => setDocente(e.target.value)}
                >
                  <option value="">Seleccione una opción</option>
                  {docentes.map((docente) => (
                    <option key={docente.id} value={docente.id}>
                      {docente.nombre} {docente.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-class form-group">
                <label className="form-label">Grado</label>
                <select
                  name="grado"
                  className="form-select"
                  required
                  onChange={(e) => setGrado(e.target.value)}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="5to grado">5to grado</option>
                  <option value="6to grado">6to grado</option>
                </select>
              </div>

              <div className="form-class form-group">
                <label className="form-label">Imagen del curso</label>
                <input
                  type="file"
                  name="imagen"
                  className="form-file"
                  accept="image/*"
                  onChange={(e) => setImagen(e.target.files[0])}
                />
              </div>

              {/* Este ocupa toda la fila */}
              <div className="form-class form-group full-width">
                <label className="form-label">Descripción</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Breve descripción del curso..."
                  required
                  onChange={(e) => setDescripcion(e.target.value)}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="form-button">
              Agregar Curso
            </button>
          </form>
        </Modal>
      </div>
      <div className="bodyCursos">
        {cursos && cursos.length > 0 ? (
          cursos.map((curso) => (
            <div className="cardCurso" key={curso.id}>
              <h2>{curso.curso}</h2>
              <p>{curso.description}</p>
              <p>Grado: {curso.grado}</p>

              <button
                className="buttonVerDetalles"
                onClick={() => {
                  setCursoSeleccionado(curso);
                  setOpenModalCursos(true);
                }}
              >
                Ver detalles
              </button>
            </div>
          ))
        ) : (
          <p>No hay cursos disponibles</p>
        )}
        {cursoSeleccionado && (
          <Modal
            isOpen={openModalCursos}
            onClose={() => {
              setOpenModalCursos(false);
              setCursoSeleccionado(null);
            }}
            title={"Detalles del Curso"}
          >
            <div className="cursoDetalleContainer">
              <div className="imagenCurso">
                <img
                  src={cursoSeleccionado.imagenUrl}
                  alt={cursoSeleccionado.curso}
                />
              </div>

              <div className="detallesCurso">
                <h2>{cursoSeleccionado.curso}</h2>
                <p>
                  <strong>Descripción:</strong>{" "}
                  {cursoSeleccionado.descripcion}
                </p>
                <p>
                  <strong>Docente:</strong>{" "}
                  {cursoSeleccionado.docente}
                </p>
                <p>
                  <strong>Grado:</strong> {cursoSeleccionado.grado}
                </p>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
