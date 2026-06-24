import { apiRequest } from "./api";

// ─── CONTATOS EMPRESA → ALUNO ──────────────────────────────────────────────────

export async function getContatosByAluno(alunoId) {
  return apiRequest(`/contatos/aluno/${alunoId}`);
}

export async function createContato(data) {
  return apiRequest("/contatos/", { method: "POST", body: data });
}

export async function getContatoPorId(id) {
  return apiRequest(`/contatos/${id}`);
}
