import { apiRequest } from "./api";

export async function getRanking(filtros = {}) {
  return apiRequest("/ranking/", {
    params: filtros,
  });
}

export async function getDestaques(filtros = {}, limite = 3) {
  return apiRequest("/ranking/destaques", {
    params: {
      ...filtros,
      limite,
    },
  });
}
