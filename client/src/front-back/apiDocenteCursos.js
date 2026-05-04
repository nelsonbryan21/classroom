const API_URL = "http://localhost:5000/api";
// const API_URL = "https://classroom-09y7.onrender.com/api";

export const getListCursosDocente = async (id) => {
  const response = await fetch(`${API_URL}/listCursosDocente/${id}`);

  if (!response.ok) {
    const text = await response.text();
    console.error("Error:", text);
    throw new Error("Error al obtener cursos");
  }

  return response.json();
};

export const insertAlumnoCurso = async (formData) => {
  const response = await fetch(`${API_URL}/insertAlumnoCursos`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const updateAlumno = async (id, formData) => {
  const response = await fetch(`${API_URL}/updateAlumno/${id}`, {
    method: "PUT",
    body: formData,
  });
  return response.json();
};

export const listAlumnosCursos = async (id) => {
  const response = await fetch(`${API_URL}/listAlumnosCursos/${id}`);
  return response.json();
};

export const deleteAlumnoCurso = async (id) => {
  const response = await fetch(`${API_URL}/deleteAlumnoCurso/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export const marcarAsistencia = async (data) => {
  const response = await fetch(`${API_URL}/marcarAsistencia`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const materialCurso = async (formData) => {
  const response = await fetch(`${API_URL}/materialCurso`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const listadoMaterialCurso = async (id) => {
  const response = await fetch(
    `${API_URL}/listadoMaterialCurso/${id}`,
    {
      method: "GET",
    },
  );
  return response.json();
};

export const materialPorCurso = async (id) => {
  const response = await fetch(`${API_URL}/materialPorCurso/${id}`, {
    method: "GET",
  });
  return response.json();
};

export const getFormularioByDocumento = async (id) => {
  const response = await fetch(
    `${API_URL}/getFormularioByDocumento/${id}`,
  );
  return response.json();
};

export const insertNota = async (data) => {
  const response = await fetch(`${API_URL}/insertNota`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const listCursosAlumno = async (id) => {
  const response = await fetch(`${API_URL}/listCursosAlumno/${id}`);
  return response.json();
};

export const submitExamen = async (data) => {
  const response = await fetch(`${API_URL}/submitExamen`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getAllMaterialesPendientes = async (id) => {
  const response = await fetch(
    `${API_URL}/getAllMaterialesPendientes/${id}`,
  );
  return response.json();
}

export const updateEstadoMaterial = async (id) => {
  const response = await fetch(`${API_URL}/updateEstadoMaterial/${id}`, {
    method: "PUT",
  });
  return response.json();
};

export const getMaterialesPendientes = async (id) => {
  const response = await fetch(
    `${API_URL}/getMaterialesPendientes/${id}`,
  );
  return response.json();
};

export const getAlumnosSinNota = async (data) => {
  const response = await fetch(`${API_URL}/getAlumnosSinNota`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
export const getAlumnosConParticipaciones = async (documentoId, cursoId) => {
  const response = await fetch(`${API_URL}/getParticipaciones/${documentoId}/${cursoId}`);
  return response.json();
}
export const finalizarRevision = async (id) => {
  const response = await fetch(`${API_URL}/updateEstadoMaterial/${id}`, {
    method: "POST",
  });
  return response.json();
}

export const sumarParticipacion = async (data) => {
  const response = await fetch(`${API_URL}/insertParticipaciones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateParticipaciones = async (data) => {
  const response = await fetch(`${API_URL}/updateParticipaciones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const uploadPlanTrabajo = async (formData) => {
  const response = await fetch(`${API_URL}/uploadPlanTrabajo`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const listPlanesTrabajo = async (docenteId) => {
  const response = await fetch(
    `${API_URL}/listPlanesTrabajo/${docenteId}`,
  );
  return response.json();
};

export const getFechasAsistencia = async (cursoId) => {
  const response = await fetch(
    `${API_URL}/getFechasAsistencia/${cursoId}`,
  );
  return response.json();
};

export const getAsistenciaFecha = async (cursoId, fecha) => {
  const response = await fetch(`${API_URL}/getAsistenciaFecha`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cursoId, fecha }),
  });
  return response.json();
};

export const getDashboardStats = async (id) => {
  const response = await fetch(`${API_URL}/dashboardStats/${id}`);
  return response.json();
};

export const getMaterialById = async (id) => {
  const response = await fetch(`${API_URL}/getMaterialById/${id}`);
  return response.json();
};


export const getDataDashboardDocente = async (id) => {
  const response = await fetch(
    `${API_URL}/getDataDashboardDocente/${id}`,
  );
  return response.json();
};

export const generarReporteCursoData = async (data) => {
  const response = await fetch(`${API_URL}/generarReporteCurso`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
