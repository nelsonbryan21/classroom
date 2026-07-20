const pool = require("../db/database");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const verificationCodes = new Map();

const sendValidationCode = async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ error: "Correo requerido para enviar código." });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes.set(correo, { code, timestamp: Date.now() });

  try {
    const transporter = nodemailer.createTransport({
      // service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      family: 4,

      auth: {
        user: process.env.EMAIL_USER || "iesanantonio3@gmail.com",
        pass: process.env.EMAIL_PASS || "drtp nlfu bolx qhnw",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || "iesanantonio3@gmail.com",
      to: correo,
      subject: "Código de Verificación - Registro de Usuario",
      html: `<h3>Tu código de verificación para la plataforma escolar es: <b>${code}</b></h3>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Código enviado a tu correo exitosamente." });
  } catch (error) {
    console.error("Error enviando correo con Nodemailer:", error);
    res.status(500).json({ success: false, error: "Error enviando correo. Revisa tus credenciales EMAIL_USER y EMAIL_PASS en el .env." });
  }
};

const registerUsers = async (req, res) => {
  const { correo, contrasena, rol, nombre, apellido, dni, codigo, adminBypass } = req.body;
  const image = req.file ? req.file.filename : null;

  // Validar Código Único de Registro enviado al correo, excepto si viene del Director (adminBypass)
  if (adminBypass !== "true") {
    const storedCodeData = verificationCodes.get(correo);
    
    if (!storedCodeData || storedCodeData.code !== codigo) {
      return res.status(400).json({ success: false, error: "Código de verificación incorrecto o no solicitado." });
    }
    // Consumir el código para que no se re-use
    verificationCodes.delete(correo);
  }

  try {
    // Validar Correo Electrónico Único
    const userExist = await pool.query("SELECT * FROM usuarios WHERE username = $1", [correo]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ success: false, error: "El correo electrónico ya se encuentra registrado." });
    }

    // Validar DNI Único (En directores o docentes)
    const dniExistDocente = await pool.query("SELECT * FROM docentes WHERE dni = $1", [dni]);
    const dniExistDirector = await pool.query("SELECT * FROM usuarios WHERE dnidirector = $1", [dni]);
    if (dniExistDocente.rows.length > 0 || dniExistDirector.rows.length > 0) {
      return res.status(400).json({ success: false, error: "El DNI proporcionado ya se encuentra registrado." });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 8);

    if (rol === "director") {
      const query = `INSERT INTO usuarios (username, password_hash, rol, imagen, nombreDirector,apellidoDirector,dniDirector)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const result = await pool.query(query, [
        correo,
        hashedPassword,
        rol,
        image,
        nombre,
        apellido,
        dni
      ]);
      return res.status(201).json({ success: true, user: result.rows[0] });
    }
    const query = `INSERT INTO usuarios (username, password_hash, rol, imagen)
     VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(query, [
      correo,
      hashedPassword,
      rol,
      image,
    ]);
    if (result.rows.length > 0 && rol === "docente") {
      const newUser = result.rows[0];
      const docenteQuery =
        "INSERT INTO docentes (usuario_id, nombre, correo, apellido, dni) VALUES ($1, $2, $3, $4, $5)";
      await pool.query(docenteQuery, [
        newUser.id,
        nombre,
        correo,
        apellido,
        dni
      ]);
      res.status(201).json({ success: true, user: newUser });
      return;
    }

    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const listUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.nombre,d.apellido, d.correo, d.estado, u.imagen, d.dni
      FROM docentes d 
      INNER JOIN usuarios u ON d.usuario_id = u.id
    `);

    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

    const usersWithImageUrl = result.rows.map((user) => ({
      ...user,
      imagen: user.imagen
        ? `${BACKEND_URL}/uploads/img/perfil/${user.imagen}`
        : null,
    }));

    res.status(200).json(usersWithImageUrl);

  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const updateUser = async (req, res) => {
  const docenteId = req.params.id;
  const { nombre, apellido, correo, dni, contrasena } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const docenteRes = await pool.query("SELECT usuario_id FROM docentes WHERE id = $1", [docenteId]);
    if (docenteRes.rows.length === 0) return res.status(404).json({ success: false, error: "Docente no encontrado" });
    const usuarioId = docenteRes.rows[0].usuario_id;

    // Validar Correo y DNI únicos si se cambian (excluyendo el actual)
    const userExist = await pool.query("SELECT * FROM usuarios WHERE username = $1 AND id != $2", [correo, usuarioId]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ success: false, error: "El correo electrónico ya está en uso." });
    }
    const dniExist = await pool.query("SELECT * FROM docentes WHERE dni = $1 AND id != $2", [dni, docenteId]);
    if (dniExist.rows.length > 0) {
      return res.status(400).json({ success: false, error: "El DNI proporcionado ya está en uso." });
    }

    // Actualizar docente
    await pool.query(
      "UPDATE docentes SET nombre = $1, apellido = $2, correo = $3, dni = $4 WHERE id = $5",
      [nombre, apellido, correo, dni, docenteId]
    );

    // Actualizar usuario
    let userQuery = "UPDATE usuarios SET username = $1";
    let params = [correo];
    let counter = 2;

    if (contrasena) {
      const hashedPassword = await bcrypt.hash(contrasena, 8);
      userQuery += `, password_hash = $${counter}`;
      params.push(hashedPassword);
      counter++;
    }

    if (image) {
      userQuery += `, imagen = $${counter}`;
      params.push(image);
      counter++;
    }

    userQuery += ` WHERE id = $${counter}`;
    params.push(usuarioId);

    await pool.query(userQuery, params);

    res.json({ success: true, message: "Docente actualizado correctamente" });
  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
};



module.exports = {
  registerUsers,
  listUsers,
  sendValidationCode,
  updateUser,
};
