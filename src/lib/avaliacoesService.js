import { apiRequest } from "./api";
import { getCurrentUserId } from "./session";

export async function createAvaliacao(data) {
  return apiRequest("/avaliacoes", { method: "POST", body: data });
}

export async function getAvaliacao(id) {
  return apiRequest(`/avaliacoes/${id}`);
}

export async function updateAvaliacao(id, data) {
  return apiRequest(`/avaliacoes/${id}`, { method: "PUT", body: data });
}

export async function deleteAvaliacao(id) {
  return apiRequest(`/avaliacoes/${id}`, { method: "DELETE" });
}

export async function listAvaliacoesProfessor(professorId = getCurrentUserId()) {
  return apiRequest(`/professores/${professorId}/avaliacoes`);
}
