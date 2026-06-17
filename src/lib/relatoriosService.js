import { apiRequest, buildQuery } from "./api";

export async function getRelatorioProjetos(filtros = {}) {
  return apiRequest(`/relatorios/projetos${buildQuery(filtros)}`);
}

export async function getRelatorioAcademico(filtros = {}) {
  return apiRequest(`/relatorios/academico${buildQuery(filtros)}`);
}

export async function listLogs(filtros = {}) {
  return apiRequest(`/logs${buildQuery(filtros)}`);
}

export async function getLog(id) {
  return apiRequest(`/logs/${id}`);
}
