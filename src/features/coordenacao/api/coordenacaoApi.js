import { apiRequest } from "../../../lib/api";
import { getCurrentUserId } from "../../../lib/authService"; // Mantemos as utilidades no authService por enquanto

export async function getCoordenadorPerfil() {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/coordenadores/${userId}`);
}

export async function updateCoordenadorPerfil(data) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/coordenadores/${userId}`, { method: "PUT", body: data });
}

export async function getCoordenadores() {
  return apiRequest("/coordenadores/");
}
