import { apiRequest } from "./api";

/*
 * Endpoint específico do aluno autenticado.
 */
export async function getMeusPortfolios() {
  return apiRequest("/portfolios/meus");
}

/*
 * Mantido temporariamente porque a área da empresa
 * ainda importa esta função. O fluxo da empresa será
 * corrigido separadamente.
 */
export async function getPortfolioList() {
  return apiRequest("/portfolios/");
}

export async function getPortfolioPorId(id) {
  return apiRequest(`/portfolios/${id}`);
}

export async function createPortfolio(data) {
  return apiRequest("/portfolios/", {
    method: "POST",
    body: data,
  });
}

export async function updatePortfolio(id, data) {
  return apiRequest(`/portfolios/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deletarPortfolio(id) {
  return apiRequest(`/portfolios/${id}`, {
    method: "DELETE",
  });
}
