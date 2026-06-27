import { apiRequest } from "./api";

function criarQuery(filtros = {}) {
  const params = new URLSearchParams();

  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") {
      params.set(chave, valor);
    }
  });

  const query = params.toString();

  return query ? `?${query}` : "";
}

export async function getRanking(filtros = {}) {
  return apiRequest(`/ranking/${criarQuery(filtros)}`);
}

export async function getDestaques(filtros = {}, limite = 3) {
  return apiRequest(
    `/ranking/destaques${criarQuery({
      ...filtros,
      limite,
    })}`,
  );
}
