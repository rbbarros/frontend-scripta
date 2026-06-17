import { apiRequest } from "./api";

export async function listarContatosEmpresa() {
  return apiRequest("/contato-empresa/");
}

export async function criarContatoEmpresa(data) {
  return apiRequest("/contato-empresa/", {
    method: "POST",
    body: data,
  });
}
