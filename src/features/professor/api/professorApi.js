import { apiRequest } from "../../../lib/api";
import { getCurrentUserId } from "../../../lib/authService"; // Mantemos as utilidades no authService por enquanto

export async function getProfessorPerfil() {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/professores/${userId}`);
}

export async function updateProfessorPerfil(data) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/professores/${userId}`, { method: "PUT", body: data });
}

export async function getProfessores() {
  return apiRequest("/professores/");
}
