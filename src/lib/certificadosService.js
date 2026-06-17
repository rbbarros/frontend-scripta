import { apiRequest, buildQuery } from "./api";

export async function listCertificados(filtros = {}) {
  return apiRequest(`/certificados${buildQuery(filtros)}`);
}

export async function getCertificado(id) {
  return apiRequest(`/certificados/${id}`);
}

export async function emitirCertificado(data) {
  return apiRequest("/certificados", { method: "POST", body: data });
}

export async function deleteCertificado(id) {
  return apiRequest(`/certificados/${id}`, { method: "DELETE" });
}
