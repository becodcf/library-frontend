import { api } from "./api";

async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

async function register(name, email, password) {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
}

async function me() {
  const response = await api.get("/auth/me");
  return response.data;
}

export const authService = { login, register, me };
