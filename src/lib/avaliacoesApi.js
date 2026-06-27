import { apiRequest } from "./api";

export async function getAvaliacoes() {
  return apiRequest("/avaliacoes/");
}

export async function getAvaliacoesPorProjeto(projetoId) {
  return apiRequest(`/avaliacoes/projeto/${projetoId}`);
}

export async function getAvaliacaoPorId(avaliacaoId) {
  return apiRequest(`/avaliacoes/${avaliacaoId}`);
}

export async function createAvaliacao(data) {
  return apiRequest("/avaliacoes/", {
    method: "POST",
    body: data,
  });
}

export async function updateAvaliacao(avaliacaoId, data) {
  return apiRequest(`/avaliacoes/${avaliacaoId}`, {
    method: "PUT",
    body: data,
  });
}
