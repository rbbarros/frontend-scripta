import { apiRequest } from "./api";

const TOKEN_KEY = "scripta_token";
const LEGACY_USER_TYPE_KEY = "scripta_user_type";

const HOME_ROUTES = {
  aluno: "/aluno",
  professor: "/professor",
  empresa: "/empresa",
  coordenador: "/coordenacao",
};

const PERFIS_VALIDOS = Object.keys(HOME_ROUTES);

function decodeTokenPayload(token) {
  if (!token) {
    return null;
  }

  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) {
      return null;
    }

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");

    const paddingLength = (4 - (normalized.length % 4)) % 4;

    const paddedPayload = normalized + "=".repeat(paddingLength);

    const bytes = Uint8Array.from(atob(paddedPayload), (character) =>
      character.charCodeAt(0),
    );

    const decoded = new TextDecoder().decode(bytes);

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function saveSession(accessToken) {
  const payload = decodeTokenPayload(accessToken);

  const perfil = payload?.perfil;
  const id = Number(payload?.sub);

  if (
    !accessToken ||
    !PERFIS_VALIDOS.includes(perfil) ||
    !Number.isInteger(id)
  ) {
    throw new Error("O servidor retornou uma sessão inválida.");
  }

  localStorage.setItem(TOKEN_KEY, accessToken);

  // Remove o valor antigo controlado pelo dropdown.
  localStorage.removeItem(LEGACY_USER_TYPE_KEY);

  return {
    token: accessToken,
    id,
    perfil,
    email: payload?.email ?? null,
  };
}

export function getCurrentSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const payload = decodeTokenPayload(token);

  if (!token || !payload) {
    return null;
  }

  if (payload.exp && Date.now() >= payload.exp * 1000) {
    clearSession();
    return null;
  }

  const perfil = payload.perfil;
  const id = Number(payload.sub);

  if (!PERFIS_VALIDOS.includes(perfil) || !Number.isInteger(id)) {
    clearSession();
    return null;
  }

  return {
    token,
    id,
    perfil,
    email: payload?.email ?? null,
  };
}

export function getCurrentUserId() {
  return getCurrentSession()?.id ?? null;
}

export function getCurrentUserType() {
  return getCurrentSession()?.perfil ?? null;
}

export function getHomeRoute(perfil) {
  return HOME_ROUTES[perfil] ?? "/";
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LEGACY_USER_TYPE_KEY);
}

export async function login({ email, senha }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: {
      email,
      senha,
    },
  });
}

export async function registerAluno(data) {
  return apiRequest("/alunos/", {
    method: "POST",
    body: data,
  });
}

export async function registerProfessor(data) {
  return apiRequest("/professores/", {
    method: "POST",
    body: data,
  });
}

export async function registerEmpresa(data) {
  return apiRequest("/empresas/", {
    method: "POST",
    body: data,
  });
}
