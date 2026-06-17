import { apiRequest, buildQuery } from "./api";

export async function getRanking(filtros = {}) {
  return apiRequest(`/ranking${buildQuery(filtros)}`);
}
