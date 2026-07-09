import { api } from "./api";

async function list() {
  const response = await api.get("/readers");
  return response.data;
}

async function get(id) {
  const response = await api.get(`/readers/${id}`);
  return response.data;
}

async function create(reader) {
  const response = await api.post("/readers", reader);
  return response.data;
}

async function update(id, reader) {
  const response = await api.put(`/readers/${id}`, reader);
  return response.data;
}

async function remove(id) {
  const response = await api.delete(`/readers/${id}`);
  return response.data;
}

export const readerService = { list, get, create, update, remove };
