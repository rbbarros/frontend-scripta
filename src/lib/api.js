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

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {}, ...rest } = options;

  const token = localStorage.getItem("scripta_token");

  const authHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, response.statusText));
  }

  return data;
}
