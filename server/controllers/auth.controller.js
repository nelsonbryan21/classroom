// controllers/auth.controller.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/database");
const SECRET_KEY = process.env.JWT_SECRET;

const login = async (req, res) => {
  const backendUrl = process.env.BACKEND_URL;
  const { username, password } = req.body;
  try {
    const query = "SELECT * FROM usuarios WHERE username = $1";
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }
    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const payload = {
      id: user.id,
      username: user.username,
      rol: user.rol,
      nombreDirector: user.nombredirector,
      apellidoDirector: user.apellidodirector,
      dniDirector: user.dnidirector,
      imagen: user.imagen
        ? (user.imagen.startsWith("http") ? user.imagen : `${backendUrl}/uploads/img/perfil/${user.imagen}`)
        : null,
    };


    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "Login exitoso",
      token: token,
      user: payload,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const validateToken = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded);
    res.json({
      valid: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

const register = async (req, res) => {
  const { username, password, rol } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    const query =
      "INSERT INTO usuarios (username, password_hash, rol) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(query, [
      username,
      hashedPassword,
      rol,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  login,
  validateToken,
  register,
};
