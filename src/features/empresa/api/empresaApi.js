import { apiRequest } from "../../../lib/api";
import { getCurrentUserId } from "../../../lib/authService";

export async function getEmpresaPerfil() {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/empresas/${userId}`);
}

export async function updateEmpresaPerfil(data) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/empresas/${userId}`, { method: "PUT", body: data });
}

export async function getEmpresas() {
  return apiRequest("/empresas/");
}
