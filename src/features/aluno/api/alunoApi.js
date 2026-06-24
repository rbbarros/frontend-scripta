import { apiRequest } from "../../../lib/api";
import { getCurrentUserId } from "../../../lib/authService";

export async function getAlunoPerfil() {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/alunos/${userId}`);
}

export async function updateAlunoPerfil(data) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/alunos/${userId}`, { method: "PUT", body: data });
}

export async function getAlunos() {
  return apiRequest("/alunos/");
}
