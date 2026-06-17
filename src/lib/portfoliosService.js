import { apiRequest, buildQuery } from "./api";

export async function listPortfolios(filtros = {}) {
  return apiRequest(`/portfolios${buildQuery(filtros)}`);
}

export async function getPortfolio(id) {
  return apiRequest(`/portfolios/${id}`);
}

export async function createPortfolio(data) {
  return apiRequest("/portfolios", { method: "POST", body: data });
}

export async function updatePortfolio(id, data) {
  return apiRequest(`/portfolios/${id}`, { method: "PUT", body: data });
}

export async function deletePortfolio(id) {
  return apiRequest(`/portfolios/${id}`, { method: "DELETE" });
}
