const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  return localStorage.getItem("scripta_token");
}

export function buildQuery(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, value);
    }
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {}, ...rest } = options;
  const token = getToken();

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

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
    const message = data?.detail || data?.message || response.statusText;
    throw new Error(message || "Erro na requisição");
  }

  return data;
}

export async function apiUpload(path, formData, options = {}) {
  const { method = "POST", headers = {}, ...rest } = options;
  const token = getToken();

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...authHeaders,
      ...headers,
    },
    body: formData,
    ...rest,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.detail || data?.message || response.statusText;
    throw new Error(message || "Erro no envio do arquivo");
  }

  return data;
}
