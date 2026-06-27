import { apiRequest } from "./api";

export async function getMeusPortfolios() {
  return apiRequest("/portfolios/meus");
}

export async function getPortfoliosPublicos() {
  return apiRequest("/portfolios/publicos");
}

export async function getPortfoliosDoAluno(idAluno) {
  return apiRequest(`/portfolios/aluno/${idAluno}`);
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
