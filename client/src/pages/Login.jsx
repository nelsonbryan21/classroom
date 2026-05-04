import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Toast from "../components/Toast";
import SplashLogin from "../components/SplashLogin";
import RedirectLoader from "../components/RedirectLoader";

const images = ["/img3.webp", "/img2.webp", "/fondoLogin.jpg"];

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [currentImage, setCurrentImage] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     const user = JSON.parse(storedUser);
  //     switch (user.rol) {
  //       case "director":
  //         navigate("/dashboard", { replace: true });
  //         break;
  //       case "docente":
  //         navigate("/mis-cursos", { replace: true });
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // }, [navigate]);

  useEffect(() => {
    if (user) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        switch (user.rol) {
          case "director":
            navigate("/dashboard", { replace: true });
            break;
          case "docente":
            navigate("/mis-cursos", { replace: true });
            break;
          default:
            break;
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      Toast("Error", "Por favor, complete todos los campos", "error");
      return;
    }
    
    const res = await login(username, password);

    // if (res.success) {
    //   const user = localStorage.getItem("user");
    //   const user2 = JSON.parse(user).rol;

    //   switch (user2) {
    //     case "director":
    //       navigate("/dashboard", { replace: true });
    //       break;
    //     case "docente":
    //       navigate("/mis-cursos", { replace: true });
    //       break;
    //     default:
    //       navigate("/", { replace: true });
    //       break;
    //   }
    // }
    if (res.success) {
      setIsRedirecting(true);
      setTimeout(() => {
        switch (res.user.rol) {
          case "director":
            navigate("/dashboard", { replace: true });
            break;
          case "docente":
            navigate("/mis-cursos", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
            break;
        }
      }, 2000);
    } else {
      setErrorMsg(res.error);
    }
  };

  useEffect(() => {
    if (errorMsg) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMsg,
        confirmButtonText: "Cerrar",
      }).then(() => setErrorMsg(""));
    }
  }, [errorMsg]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  return (
    <>
      {showSplash && <SplashLogin onFinish={() => setShowSplash(false)} />}
      {isRedirecting && <RedirectLoader message="Iniciando sesión..." />}
      
      <div
        className="boxLogin"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      >
      <div className="loginContent">
        <h3>Bienvenido a la plataforma de gestion estudiantil</h3>
        <div className="cardLogin">
          <form onSubmit={handleLogin}>
            <fieldset>
              <legend id="legendLogin">Iniciar sesión</legend>
              <div className="bloqueInput">
                <img
                  className="imagenLogin"
                  src="/login.png"
                  alt=""
                />
              </div>
              <div className="bloqueInput">
                <label className="labelInput" htmlFor="user">
                  usuario
                </label>
                <input
                  type="text"
                  id="user"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="bloqueInput">
                <label className="labelInput" htmlFor="pass">
                  contraseña
                </label>
                <input
                  type="password"
                  id="pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="bloqueButtonLogin">
                <label htmlFor="buttonLogin">Ingresar</label>
                <button className="buttonLogin" type="submit">
                  Ingresar
                </button>
                <label htmlFor="buttonLogin">Ingresar</label>
                <button
                  className="buttonRegistro"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/registro");
                  }}
                  style={{ marginTop: "10px", backgroundColor: "#3b82f6" }}
                >
                  Registrar usuario
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
