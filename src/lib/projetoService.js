import { apiRequest } from "./api";

export async function atualizarProjeto(id, data) {
  return apiRequest(`/projetos/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function atualizarStatusProjeto(id, status) {
  return apiRequest(`/projetos/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function deletarProjeto(id) {
  return apiRequest(`/projetos/${id}`, {
    method: "DELETE",
  });
}
