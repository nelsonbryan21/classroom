import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Toast from "../components/Toast";
import RedirectLoader from "../components/RedirectLoader";
import { registerUser, sendValidationCode } from "../front-back/apiDirector";
import "../styles/registro.css";

const images = ["/img3.webp", "/img2.webp", "/fondoLogin.jpg"];

export default function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    correo: "",
    contrasena: "",
    rol: "director",
  });
  const [codigo, setCodigo] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.nombre.trim() || !formData.correo.trim() || !formData.contrasena.trim() || !codigo.trim()) {
      Toast("Error", "Por favor, complete los campos obligatorios, incluyendo el código único", "error");
      return;
    }
    // El código será validado por NodeMailer en el Backend.

    try {
      const formToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formToSend.append(key, formData[key]);
      });
      formToSend.append("codigo", codigo);
      if (image) {
        formToSend.append("image", image);
      }

      const data = await registerUser(formToSend);

      if (data && data.success) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Usuario registrado correctamente",
          confirmButtonColor: "#3b82f6"
        }).then(() => {
          setIsRedirecting(true);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        });
      } else {
        Toast("Error", data?.error || "Ocurrió un error al registrar", "error");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      Toast("Error", "Error de conexión con el servidor", "error");
    }
  };

  return (
    <>
      {isRedirecting && <RedirectLoader message="Preparando tu cuenta..." />}
      <div
        className="boxRegistro"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      >
      <div className="registroContent">
        <h3>Registro de Usuario</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGrid">
            <div className="formGroup">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan"
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ej: Pérez"
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                name="dni"
                maxLength={8}
                value={formData.dni}
                onChange={handleChange}
                placeholder="N° de documento"
              />
            </div>

            <div className="formGroup full-width">
              <label htmlFor="correo">Correo Electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="formGroup full-width">
              <label htmlFor="contrasena">Contraseña</label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div className="formGroup full-width">
              <label htmlFor="codigo">Código Único de Registro</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ingrese el código enviado a su correo"
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  disabled={codeSent}
                  onClick={async () => {
                    if (!formData.correo) {
                      return Toast("Error", "Ingrese su correo primero", "error");
                    }
                    Toast("Info", "Enviando código a tu Gmail...", "info");
                    try {
                      const res = await sendValidationCode(formData.correo);
                      if (res.success) {
                        setCodeSent(true);
                        Toast("Éxito", res.message || "Código enviado a tu correo", "success");
                      } else {
                        Toast("Error", res.error || "No se pudo enviar el código", "error");
                      }
                    } catch (error) {
                      Toast("Error", "Fallo de conexión", error);
                    }
                  }}
                  style={{ padding: "0 15px", borderRadius: "10px", background: codeSent ? "#ccc" : "#3b82f6", color: "white", border: "none", cursor: codeSent ? "not-allowed" : "pointer", fontWeight: "bold" }}
                >
                  {codeSent ? "Código Enviado" : "Enviar Código al Gmail"}
                </button>
              </div>
            </div>

            <div className="formGroup full-width">
              <label htmlFor="image">Foto de Perfil (Opcional)</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="registroActions">
              <button type="submit" className="btnSubmit">
                Completar Registro
              </button>
              <button
                type="button"
                className="btnBack"
                onClick={() => navigate("/login")}
              >
                Volver al Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
