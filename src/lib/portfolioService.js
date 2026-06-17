import { apiRequest } from "./api";

export async function atualizarPortfolio(id, data) {
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
