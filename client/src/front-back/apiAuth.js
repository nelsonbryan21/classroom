// const API_URL = "http://localhost:5000/api";
const API_URL = "https://classroom-production-6289.up.railway.app/api";
// const API_URL = "https://classroom-09y7.onrender.com/api";

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error };
    }

    if (data.token) {
      localStorage.setItem("jwtToken", data.token);
    }
    return { data };

  } catch (error) {
    // console.error("Login error:", error);
    return { success: false, error: "Error en la petición" };
  }
};

export const validate = async (token) => {
  const response = await fetch(`${API_URL}/validateToken`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
