import { apiRequest } from "./api";

// ─── PROJETOS ──────────────────────────────────────────────────────────────────

export async function getProjetos() {
  return apiRequest("/projetos/");
}

export async function getProjetoPorId(id) {
  return apiRequest(`/projetos/${id}`);
}

export async function createProjeto(data) {
  return apiRequest("/projetos/", { method: "POST", body: data });
}

export async function updateProjeto(id, data) {
  return apiRequest(`/projetos/${id}`, { method: "PUT", body: data });
}

export async function updateProjetoStatus(id, status) {
  return apiRequest(`/projetos/${id}/status`, { method: "PATCH", body: { status } });
}

export async function deletarProjeto(id) {
  return apiRequest(`/projetos/${id}`, { method: "DELETE" });
}

// ─── INTEGRANTES DE PROJETO ────────────────────────────────────────────────────

export async function getIntegrantesDoProjeto(projetoId) {
  return apiRequest(`/projetos/${projetoId}/integrantes/`);
}

export async function addIntegranteAoProjeto(projetoId, data) {
  return apiRequest(`/projetos/${projetoId}/integrantes/`, { method: "POST", body: data });
}
