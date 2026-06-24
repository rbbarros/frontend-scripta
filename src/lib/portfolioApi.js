import { apiRequest } from "./api";

// ─── PORTFÓLIO ─────────────────────────────────────────────────────────────────

export async function getPortfolioList() {
  return apiRequest("/portfolios/");
}

export async function getPortfolioPorId(id) {
  return apiRequest(`/portfolios/${id}`);
}

export async function createPortfolio(data) {
  return apiRequest("/portfolios/", { method: "POST", body: data });
}

export async function updatePortfolio(id, data) {
  return apiRequest(`/portfolios/${id}`, { method: "PUT", body: data });
}

export async function deletarPortfolio(id) {
  return apiRequest(`/portfolios/${id}`, { method: "DELETE" });
}
