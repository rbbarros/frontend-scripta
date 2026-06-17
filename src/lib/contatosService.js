import { apiRequest } from "./api";

export async function createContato(data) {
  return apiRequest("/contatos", { method: "POST", body: data });
}

export async function getContato(id) {
  return apiRequest(`/contatos/${id}`);
}

export async function listContatosAluno(alunoId) {
  return apiRequest(`/contatos/aluno/${alunoId}`);
}
