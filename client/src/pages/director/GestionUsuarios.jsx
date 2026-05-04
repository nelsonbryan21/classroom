import { useEffect, useState } from "react";
import "../../styles/director/gestionUsuarios.css";
import Modal from "../../components/Modal";
import {
  desactivarUser,
  getListUsers,
  registerUser,
  updateUser,
} from "../../front-back/apiDirector";
import Swal from "sweetalert2";
import Table from "../../components/Table";
import Toast from "../../components/Toast";

function GestionUsuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: "", error: false });
  const [data, setData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    dni: "",
    rol: "docente",
    imagen: null,
    imagenPreview: "",
  });
  const columns = ["nombre", "correo", "opciones"];
  const [usuarios, setUsuarios] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("activo");

  useEffect(() => {
    if (alerta.mensaje) {
      Swal.fire({
        icon: alerta.error ? "error" : "success",
        title: alerta.mensaje,
      });
    }
  }, [alerta]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((prev) => ({
        ...prev,
        imagen: file,
        imagenPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.nombre.trim() || !data.apellido.trim() || !data.correo.trim() || !data.dni.trim() || (!isEditing && !data.contrasena.trim())) {
      Toast("Error", "Por favor, complete todos los campos obligatorios.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("apellido", data.apellido);
    formData.append("correo", data.correo);
    if (data.contrasena) formData.append("contrasena", data.contrasena);
    formData.append("dni", data.dni);
    formData.append("rol", data.rol);
    formData.append("adminBypass", "true"); 

    if (data.imagen) {
      formData.append("image", data.imagen);
    }

    let response;
    if (isEditing) {
      response = await updateUser(editId, formData);
    } else {
      response = await registerUser(formData);
    }

    if (response.success) {
      getDataUsers();
      handleCerrarModal();
      setAlerta({
        mensaje: isEditing ? "Docente actualizado exitosamente" : "Docente creado exitosamente",
        error: false,
      });
    } else {
      Toast("Error", response.error || "Hubo un error", "error");
    }
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditId(null);
    setData({
      nombre: "",
      apellido: "",
      correo: "",
      contrasena: "",
      dni: "",
      rol: "docente",
      imagen: null,
      imagenPreview: "",

    });
  };

  const getDataUsers = async () => {
    const result = await getListUsers();
    setUsuarios(result);
  };

  const handleDesactivar = async (id) => {
    const response = await desactivarUser(id);
    if (response.success) {
      Swal.fire({
        icon: "success",
        title: "Docente Eliminado exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
      getDataUsers();
    }
  };

  const handleEdit = (docente) => {
    setIsEditing(true);
    setEditId(docente.id);
    setData({
      nombre: docente.nombre || "",
      apellido: docente.apellido || "",
      correo: docente.correo || "",
      contrasena: "",
      dni: docente.dni || "",
      rol: "docente",
      imagen: null,
      imagenPreview: docente.imagen || "",
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    getDataUsers();
  }, []);

  return (
    <div className="containerGestion">
      <p className="titleGestion">Administración de docentes</p>
      <div className="containerbuttons">
        <div
          className="buttonGestion"
          onClick={() => {
            setIsEditing(false);
            setEditId(null);
            setData({ nombre: "", apellido: "", correo: "", contrasena: "", dni: "", rol: "docente", imagen: null, imagenPreview: "" });
            setIsModalOpen(true);
          }}
        >
          Crear Docente
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => handleCerrarModal()}
          title={isEditing ? "Editar Docente" : "Crear Docente"}
        >
          <form className="formModal" onSubmit={handleSubmit}>
            <div className="boxInformacion">
              <div className="inputsForm">
                <div className="formGroup boxName">
                  <label>Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={data.nombre}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        nombre: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="formGroup boxLastName">
                  <label>Apellido</label>
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={data.apellido}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        apellido: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="formGroup boxLastName">
                  <label>Dni:</label>
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="Dni"
                    value={data.dni}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        dni: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="formGroup boxEmail">
                  <label>Correo</label>
                  <input
                    type="email"
                    placeholder="Correo"
                    value={data.correo}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        correo: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="formGroup boxPassword">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={data.contrasena}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        contrasena: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="formGroup boxRol">
                  <label>Rol</label>
                  <select
                    value={data.rol}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        rol: e.target.value,
                      }))
                    }
                  >
                    <option value="docente">Docente</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="boxImg">
              <div className="boxImage">
                {data.imagenPreview && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      className="previewImage"
                      src={data.imagenPreview}
                      alt="Vista previa"
                      style={{
                        maxWidth: "20rem",
                        maxHeight: "20rem",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                <label>Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <button className="buttonModal" type="submit">
                {isEditing ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
      {/* <div className="filtro-estado">
        <div
          onClick={() => setFiltroEstado("activo")}
          className="botonFiltro"
        >
          Activos
        </div>

        <div
          onClick={() => setFiltroEstado("inactivo")}
          className="botonFiltro"
        >
          Inactivos
        </div>

        <div
          onClick={() => setFiltroEstado("todos")}
          className="botonFiltro"
        >
          Todos
        </div>
      </div> */}
      <Table
        columns={columns}
        data={usuarios.filter((user) => {
          if (filtroEstado === "todos") return true;
          return user.estado === filtroEstado;
        })}
        onDesactivar={handleDesactivar}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default GestionUsuarios;
