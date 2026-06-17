import { apiRequest, apiUpload, buildQuery } from "./api";

export async function listProjetos(filtros = {}) {
  return apiRequest(`/projetos${buildQuery(filtros)}`);
}

export async function getProjetosDestaque() {
  return apiRequest("/projetos/destaque");
}

export async function getProjeto(id) {
  return apiRequest(`/projetos/${id}`);
}

export async function createProjeto(data) {
  return apiRequest("/projetos", { method: "POST", body: data });
}

export async function updateProjeto(id, data) {
  return apiRequest(`/projetos/${id}`, { method: "PUT", body: data });
}

export async function deleteProjeto(id) {
  return apiRequest(`/projetos/${id}`, { method: "DELETE" });
}

export async function listIntegrantes(projetoId) {
  return apiRequest(`/projetos/${projetoId}/integrantes`);
}

export async function addIntegrante(projetoId, data) {
  return apiRequest(`/projetos/${projetoId}/integrantes`, {
    method: "POST",
    body: data,
  });
}

export async function listArquivos(projetoId) {
  return apiRequest(`/projetos/${projetoId}/arquivos`);
}

export async function uploadArquivo(projetoId, file) {
  const formData = new FormData();
  formData.append("arquivo", file);
  return apiUpload(`/projetos/${projetoId}/arquivos`, formData);
}

export async function deleteArquivo(arquivoId) {
  return apiRequest(`/arquivos/${arquivoId}`, { method: "DELETE" });
}

export async function listVersoes(projetoId) {
  return apiRequest(`/projetos/${projetoId}/versoes`);
}
