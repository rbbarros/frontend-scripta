const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function getErrorMessage(data, fallbackMessage) {
  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data?.detail)) {
    const mensagens = data.detail
      .map((erro) => {
        const campo = erro?.loc?.at(-1);

        if (erro?.type === "string_too_short") {
          if (campo === "senha" || campo === "confirmar_senha") {
            return "A senha deve ter pelo menos 6 caracteres.";
          }

          return "Um dos campos não possui o tamanho mínimo necessário.";
        }

        if (erro?.type === "missing") {
          return "Preencha todos os campos obrigatórios.";
        }

        if (!erro?.msg) {
          return null;
        }

        return erro.msg
          .replace(/^Value error,\s*/i, "")
          .replace(
            "String should have at least 6 characters",
            "A senha deve ter pelo menos 6 caracteres.",
          );
      })
      .filter(Boolean);

    if (mensagens.length > 0) {
      return [...new Set(mensagens)].join(" ");
    }
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  return fallbackMessage || "Não foi possível concluir a requisição.";
}

function montarUrl(path, params) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (!params) {
    return url.toString();
  }

  Object.entries(params).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") {
      url.searchParams.set(chave, String(valor));
    }
  });

  return url.toString();
}

async function lerErro(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  const texto = await response.text().catch(() => "");

  return texto ? { detail: texto } : null;
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    params,
    responseType = "json",
    ...rest
  } = options;

  const token = localStorage.getItem("scripta_token");

  const authHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const bodyHeaders =
    body != null && !isFormData
      ? {
          "Content-Type": "application/json",
        }
      : {};

  const response = await fetch(montarUrl(path, params), {
    method,
    headers: {
      ...bodyHeaders,
      ...authHeaders,
      ...headers,
    },
    body: body == null ? undefined : isFormData ? body : JSON.stringify(body),
    ...rest,
  });

  if (!response.ok) {
    const data = await lerErro(response);

    throw new Error(getErrorMessage(data, response.statusText));
  }

  if (response.status === 204) {
    return null;
  }

  if (responseType === "blob") {
    return response.blob();
  }

  if (responseType === "text") {
    return response.text();
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text();
}
