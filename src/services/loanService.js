import { api } from "./api";

async function list() {
  const response = await api.get("/loans");
  return response.data;
}

async function get(id) {
  const response = await api.get(`/loans/${id}`);
  return response.data;
}

async function create(loan) {
  const response = await api.post("/loans", loan);
  return response.data;
}

async function returnBook(id) {
  const response = await api.patch(`/loans/${id}/return`);
  return response.data;
}

export const loanService = { list, get, create, returnBook };
