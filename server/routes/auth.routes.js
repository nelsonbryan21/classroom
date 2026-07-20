const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const {
  login,
  validateToken,
  register,
} = require("../controllers/auth.controller");
const {
  registerUsers,
  listUsers,
  sendValidationCode,
  updateUser,
} = require("../controllers/register.controller");
const {
  getListDocentes,
  getListCursos,
  insertCurso,
  dataDashboard,
  listAllPlanesTrabajo,
  desactivarUser,
  getReportes,
} = require("../controllers/director.controller");
// docente
const {
  listCursosDocente,
  insertAlumnoCurso,
  listAlumnosCursos,
  deleteAlumnoCurso,
  marcarAsistencia,
  materialCurso,
  listadoMaterialCurso,
  materialPorCurso,
  getFormularioByDocumento,
  insertNota,
  listCursosAlumno,
  submitExamen,
  createFormulario,
  getMaterialesPendientes,
  getAlumnosSinNota,
  uploadPlanTrabajo,
  listPlanesTrabajo,
  getFechasAsistencia,
  getAsistenciaFecha,
  getDashboardStats,
  getMaterialById,
  getAllMaterialesPendientes,
  updateEstadoMaterial,
  getParticipaciones,
  insertParticipaciones,
  generarReporteCurso,
  updateParticipaciones,
  updateAlumno,
} = require("../controllers/docente.controller");

const {
  uploadPerfil: upload,
  uploadAlumnos: upload2,
  uploadMaterial,
  uploadPlan,
  uploadCursos: cursosUpload,
} = require("../config/cloudinary");

router.post("/login", login);
router.post("/register", upload.single("image"), register);
router.get("/validateToken", validateToken);

router.post("/registerUsers", upload.single("image"), registerUsers);
router.post("/sendValidationCode", sendValidationCode);
router.get("/listUsers", listUsers);
router.put("/updateUser/:id", upload.single("image"), updateUser);

// director
router.get("/listDocentes", getListDocentes);
router.get("/listCursos", getListCursos);
router.post("/insertCurso", cursosUpload.single("image"), insertCurso);
router.put("/desactivarUser/:id", desactivarUser);
router.post("/getReportes", getReportes);


// docentes
router.get("/listCursosDocente/:id", listCursosDocente);
router.post(
  "/insertAlumnoCursos",
  upload2.single("image"),
  insertAlumnoCurso
);
router.put(
  "/updateAlumno/:id",
  upload2.single("image"),
  updateAlumno
);
router.get("/listAlumnosCursos/:id", listAlumnosCursos);
router.delete("/deleteAlumnoCurso/:id", deleteAlumnoCurso);
router.post("/marcarAsistencia", marcarAsistencia);
router.post("/materialCurso", uploadPlan.single("archivo"), materialCurso);
router.get("/listadoMaterialCurso/:id", listadoMaterialCurso);
router.get("/materialPorCurso/:id", materialPorCurso);
router.post("/createFormulario", createFormulario);
router.get("/getFormularioByDocumento/:id", getFormularioByDocumento);
router.post("/insertNota", insertNota);
router.get("/listCursosAlumno/:id", listCursosAlumno);
router.post("/submitExamen", submitExamen);
router.get("/getMaterialesPendientes/:id", getMaterialesPendientes);
router.post("/getAlumnosSinNota", getAlumnosSinNota);
router.get("/getAllMaterialesPendientes/:id", getAllMaterialesPendientes);
router.post("/updateEstadoMaterial/:id", updateEstadoMaterial);
router.get("/getParticipaciones/:docId/:cursoId", getParticipaciones);
router.post("/insertParticipaciones", insertParticipaciones);
router.post("/generarReporteCurso", generarReporteCurso);
router.post("/updateParticipaciones", updateParticipaciones);

// Planes de Trabajo
router.post("/uploadPlanTrabajo", uploadMaterial.single("archivo"), uploadPlanTrabajo);
router.get("/listAllPlanesTrabajo", listAllPlanesTrabajo);
router.get("/listPlanesTrabajo/:id", listPlanesTrabajo);
router.get("/getFechasAsistencia/:id", getFechasAsistencia);
router.post("/getAsistenciaFecha", getAsistenciaFecha);
router.get("/dashboardStats/:id", getDashboardStats);
router.get("/getMaterialById/:id", getMaterialById);

// Data Dashboard

router.get("/getDataDashboard", dataDashboard);



module.exports = router;
