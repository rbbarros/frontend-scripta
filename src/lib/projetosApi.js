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
  return apiRequest(`/projetos/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function deletarProjeto(id) {
  return apiRequest(`/projetos/${id}`, { method: "DELETE" });
}

export async function addLinkAoProjeto(projetoId, data) {
  return apiRequest(`/projetos/${projetoId}/links/`, {
    method: "POST",
    body: data,
  });
}

export async function getLinksDoProjeto(projetoId) {
  return apiRequest(`/projetos/${projetoId}/links/`);
}

export async function updateLinkDoProjeto(projetoId, linkId, data) {
  return apiRequest(`/projetos/${projetoId}/links/${linkId}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteLinkDoProjeto(projetoId, linkId) {
  return apiRequest(`/projetos/${projetoId}/links/${linkId}`, {
    method: "DELETE",
  });
}

export async function getArquivosDoProjeto(projetoId) {
  return apiRequest(`/arquivos/projeto/${projetoId}`);
}

export async function createArquivoMetadata(data) {
  return apiRequest("/arquivos/metadados", {
    method: "POST",
    body: data,
  });
}

export async function updateArquivoMetadata(arquivoId, data) {
  return apiRequest(`/arquivos/${arquivoId}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteArquivoMetadata(arquivoId) {
  return apiRequest(`/arquivos/${arquivoId}`, {
    method: "DELETE",
  });
}

// ─── INTEGRANTES DE PROJETO ────────────────────────────────────────────────────

export async function getIntegrantesDoProjeto(projetoId) {
  return apiRequest(`/projetos/${projetoId}/integrantes/`);
}

export async function addIntegranteAoProjeto(projetoId, data) {
  return apiRequest(`/projetos/${projetoId}/integrantes/`, {
    method: "POST",
    body: data,
  });
}

export async function removeIntegranteDoProjeto(projetoId, alunoId) {
  return apiRequest(`/projetos/${projetoId}/integrantes/${alunoId}`, {
    method: "DELETE",
  });
}
