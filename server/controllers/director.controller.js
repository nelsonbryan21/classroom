const pool = require("../db/database");

const getListDocentes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM docentes where estado = 'activo'",
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const getListCursos = async (req, res) => {
  const BACKEND_URL =
    process.env.BACKEND_URL || "http://localhost:5000";
  try {
    const result =
      await pool.query(`select c.id, c.nombre as curso, c.descripcion as descripcion, d.nombre || ' ' || d.apellido as docente ,grado, c.imagen 
      from clases c inner join docentes d on c.docente_id = d.id where d.estado = 'activo'`);
    const resultImage = result.rows.map((curso) => ({
      ...curso,
      imagenUrl: curso.imagen
        ? (curso.imagen.startsWith("http") ? curso.imagen : `${BACKEND_URL}/uploads/img/cursos/${curso.imagen}`)
        : null,
    }));
    res.status(200).json(resultImage);
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// const insertCurso = async (req, res) => {
//   const { nombre, descripcion, docente, grado } = req.body;
//   try {
//     const result = await pool.query(
//       "INSERT INTO clases (nombre, descripcion, docente_id, grado) VALUES ($1, $2, $3,$4) RETURNING *",
//       [nombre, descripcion, docente, grado],
//     );
//     res.status(200).json(result.rows[0]);
//   } catch (error) {
//     console.error("Error en la consulta:", error);
//     res.status(500).json({ error: "Error en el servidor" });
//   }
// };

const insertCurso = async (req, res) => {
  const { nombre, descripcion, docente, grado } = req.body;
  const imagen = req.file ? (req.file.path || req.file.filename) : null;

  try {
    const result = await pool.query(
      "INSERT INTO clases (nombre, descripcion, docente_id, grado, imagen) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nombre, descripcion, docente, grado, imagen],
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const dataDashboard = async (req, res) => {
  try {
    const alumnos = await pool.query(
      `select count(*) from alumnos 
      `,
    );
    const docentes = await pool.query(
      `select count(*) from docentes 
      `,
    );
    const cursos = await pool.query(
      `select count(c.id) from clases c 
       inner join docentes d on c.docente_id = d.id 
       where d.estado = 'activo'`
    );
    const planTrabajo = await pool.query(
      `select count(*) from planes_trabajo 
      `,
    );
    res.status(200).json({
      alumnos: alumnos.rows[0].count,
      docentes: docentes.rows[0].count,
      cursos: cursos.rows[0].count,
      planTrabajo: planTrabajo.rows[0].count,
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const listAllPlanesTrabajo = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.titulo, p.descripcion, p.fecha, p.ruta_archivo,
              c.nombre as curso,
              d.nombre || ' ' || d.apellido as docente
          FROM planes_trabajo p
          LEFT JOIN clases c ON p.curso_id = c.id
          LEFT JOIN docentes d ON c.docente_id = d.id
          `,
    );

    const BACKEND_URL =
      process.env.BACKEND_URL || "http://localhost:5000";

    const planesWithUrl = result.rows.map((plan) => {
      const isHttp = plan.ruta_archivo && plan.ruta_archivo.startsWith("http");
      const normalizedPath = plan.ruta_archivo ? plan.ruta_archivo.replace(/\\/g, "/") : "";
      return {
        ...plan,
        ruta_archivo: isHttp ? plan.ruta_archivo : `${BACKEND_URL}/${normalizedPath}`,
      };
    });

    res.status(200).json(planesWithUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar planes" });
  }
};

const desactivarUser = async (req, res) => {
  // const { id } = req.params;
  // try {
  //   const id_usuario = await pool.query(
  //     "select u.id from usuarios u inner join docentes d on u.id = d.usuario_id where d.id =$1",
  //     [id],
  //   );
  //   const result = await pool.query(
  //     "DELETE FROM docentes WHERE id = $1 RETURNING *",
  //     [id],
  //   );
  //   const result2 = await pool.query(
  //     "delete from usuarios where id = $1",
  //     [id_usuario.rows[0].id],
  //   );
  //   res.json({
  //     success: true,
  //     message: "Usuario eliminado correctamente",
  //   });
  // } catch (error) {
  //   console.error("Error en la consulta:", error);
  //   res.status(500).json({ error: "Error en el servidor" });
  // }
  const { id } = req.params;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");


    const resultUser = await client.query(
      `SELECT u.id 
       FROM usuarios u 
       INNER JOIN docentes d ON u.id = d.usuario_id 
       WHERE d.id = $1`,
      [id]
    );

    if (resultUser.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Docente no encontrado",
      });
    }

    const usuarioId = resultUser.rows[0].id;


    await client.query(
      "DELETE FROM docentes WHERE id = $1",
      [id]
    );


    await client.query(
      "DELETE FROM usuarios WHERE id = $1",
      [usuarioId]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Usuario eliminado correctamente",
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error en la consulta:", error);

    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    client.release();
  }
};

const getReportes = async (req, res) => {
  const { curso, fecha, tipoReporte } = req.body;
  try {
    if (tipoReporte === "asistencia") {
      const result = await pool.query(
        `select al.apellido || ', ' || al.nombre as nombre, (a.hora_registro AT TIME ZONE 'UTC' AT TIME ZONE 'America/Lima') as hora_registro, a.presente
        from clases c inner join alumnos al on c.id = al.clase_id
        inner join asistencias a on a.alumno_id = al.id
        WHERE (a.hora_registro AT TIME ZONE 'UTC' AT TIME ZONE 'America/Lima')::date = $1
        and c.id = $2`,
        [fecha, curso],
      );
      
      const formated = result.rows.map(r => ({
        ...r,
        hora_registro: r.hora_registro ? new Date(r.hora_registro).toLocaleString('es-PE') : '-'
      }));
      res.status(200).json(formated);

    } else if (tipoReporte === "notas") {
      const result = await pool.query(`
        SELECT 
          a.apellido || ', ' || a.nombre as nombre,
          (
            SELECT COALESCE(count(p.nota), 0) 
            FROM participaciones p
            JOIN documentos d ON p.documento_id = d.id 
            WHERE p.alumno_id = a.id AND d.curso_id = $1
          ) as promedio
        FROM alumnos a
        WHERE a.clase_id = $1
      `, [curso]);
      
      const data = result.rows.map(r => ({
        ...r,
        hora_registro: "-",
        presente: null
      }));
      res.status(200).json(data);
    } else {
      res.status(400).json({ error: "Tipo de reporte inválido" });
    }
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  getListDocentes,
  getListCursos,
  insertCurso,
  dataDashboard,
  listAllPlanesTrabajo,
  desactivarUser,
  getReportes,
};
