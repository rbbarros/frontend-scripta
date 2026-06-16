import { apiRequest } from "./api";

function decodeTokenPayload(token) {
  if (!token) {
    return null;
  }

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) {
      return null;
    }

    const normalizedPayload = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(normalizedPayload);
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getCurrentUserId() {
  const token = localStorage.getItem("scripta_token");
  const payload = decodeTokenPayload(token);
  return payload?.sub;
}

export async function loginAluno({ email, senha }) {
  return apiRequest("/alunos/login", {
    method: "POST",
    body: { email, senha },
  });
}

export async function loginProfessor({ email, senha }) {
  return apiRequest("/professores/login", {
    method: "POST",
    body: { email, senha },
  });
}

export async function loginEmpresa({ email_contato, senha }) {
  return apiRequest("/empresas/login", {
    method: "POST",
    body: { email_contato, senha },
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

export async function getAlunoPerfil() {
  const userId = getCurrentUserId();

  if (!userId) {
    throw new Error("Usuário não autenticado.");
  }

  return apiRequest(`/alunos/${userId}`);
}

export async function getProfessorPerfil() {
  const userId = getCurrentUserId();

  if (!userId) {
    throw new Error("Usuário não autenticado.");
  }

  return apiRequest(`/professores/${userId}`);
}

export async function getEmpresaPerfil() {
  const userId = getCurrentUserId();

  if (!userId) {
    throw new Error("Usuário não autenticado.");
  }

  return apiRequest(`/empresas/${userId}`);
}
