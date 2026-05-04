import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { login as loginAPI } from "../front-back/apiAuth";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("jwtToken");

  let initialUser = null;
  try {
    if (
      storedUser &&
      storedUser !== "undefined" &&
      storedUser !== "null"
    ) {
      initialUser = JSON.parse(storedUser);
    }
  } catch (error) {
    // console.error("Error al parsear usuario guardado:", error);
    localStorage.removeItem("user");
  }

  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(
    storedToken &&
      storedToken !== "undefined" &&
      storedToken !== "null"
      ? storedToken
      : null
  );

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const { exp } = jwtDecode(token);
      if (!exp) return true;
      const now = Date.now() / 1000;
      return exp < now;
    } catch (error) {
      console.error("Error decodificando token:", error);
      return true;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser === "undefined" || storedUser === "null") {
      localStorage.removeItem("user");
    }
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken === "undefined" || storedToken === "null") {
      localStorage.removeItem("jwtToken");
    }

    const interval = setInterval(() => {
      const token = localStorage.getItem("jwtToken");
      if (token && isTokenExpired(token)) {
        logout();
      }
    }, 60000);

    const token = localStorage.getItem("jwtToken");
    if (
      token &&
      token !== "undefined" &&
      token !== "null" &&
      !isTokenExpired(token)
    ) {
      try {
        const decoded = jwtDecode(token);
        const userData = {
          id: decoded.id,
          nombre: decoded.username,
          rol: decoded.rol,
          imagen: decoded.imagen,
        };
        setUser(userData);
      } catch (error) {
        // console.error("Error decodificando token:", error);
        logout();
      }
    } else {
      logout();
    }
    return () => clearInterval(interval);
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await loginAPI(username, password);
      if (res.data.token && res.data.success) {
        const { token, user } = res.data;
        setUser(user);
        setToken(token);
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        return { success: true };
      } else {
        return {
          success: false,
          error: res.error || "Error desconocido",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Error en la petición" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
