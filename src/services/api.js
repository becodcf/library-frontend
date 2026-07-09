import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333"
});

// Injeta o token JWT em todas as requisições, se ele existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@library:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Se a API responder 401, o token é inválido/expirou: limpamos a sessão
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("@library:token");
      localStorage.removeItem("@library:user");
    }

    return Promise.reject(error);
  }
);

export { api };
