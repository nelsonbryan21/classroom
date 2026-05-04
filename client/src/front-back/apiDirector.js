const API_URL = "http://localhost:5000/api";
// const API_URL = "https://classroom-09y7.onrender.com/api";

export const registerUser = async (formData) => {
  const response = await fetch(`${API_URL}/registerUsers`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const updateUser = async (id, formData) => {
  const response = await fetch(`${API_URL}/updateUser/${id}`, {
    method: "PUT",
    body: formData,
  });
  return response.json();
};

export const sendValidationCode = async (correo) => {
  const response = await fetch(`${API_URL}/sendValidationCode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo }),
  });
  return response.json();
};

export const getListUsers = async () => {
  const response = await fetch(`${API_URL}/listUsers`);
  return response.json();
};

export const getListDocentes = async () => {
  const response = await fetch(`${API_URL}/listDocentes`);
  return response.json();
};

export const getListCursos = async () => {
  const response = await fetch(`${API_URL}/listCursos`);
  return response.json();
};

export const insertCurso = async (formData) => {
  const response = await fetch(`${API_URL}/insertCurso`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    return { success: false };
  }

  const result = await response.json();
  return { success: true, ...result };
};

export const getDataDashboard = async () => {
  const response = await fetch(`${API_URL}/getDataDashboard`);
  return response.json();
};

export const listAllPlanesTrabajo = async () => {
  const response = await fetch(`${API_URL}/listAllPlanesTrabajo`);
  return response.json();
};

export const desactivarUser = async (id) => {
  const response = await fetch(`${API_URL}/desactivarUser/${id}`, {
    method: "PUT",
  });
  return response.json();
};


export const getReportes = async (data) => {
  const response = await fetch(`${API_URL}/getReportes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

