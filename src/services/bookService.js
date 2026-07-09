import { api } from "./api";

async function list() {
  const response = await api.get("/books");
  return response.data;
}

async function get(id) {
  const response = await api.get(`/books/${id}`);
  return response.data;
}

async function create(book) {
  const response = await api.post("/books", book);
  return response.data;
}

async function update(id, book) {
  const response = await api.put(`/books/${id}`, book);
  return response.data;
}

async function remove(id) {
  const response = await api.delete(`/books/${id}`);
  return response.data;
}

async function uploadCover(id, file) {
  const formData = new FormData();
  formData.append("cover", file);

  const response = await api.post(`/books/${id}/cover`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
}

export const bookService = { list, get, create, update, remove, uploadCover };
