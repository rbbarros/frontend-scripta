import { apiRequest } from "./api";

// ─── Token Utilities ───────────────────────────────────────────────────────────

function decodeTokenPayload(token) {
  if (!token) return null;
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

export function getCurrentUserId() {
  const token = localStorage.getItem("scripta_token");
  const payload = decodeTokenPayload(token);
  return payload?.sub;
}

export function getCurrentUserType() {
  return localStorage.getItem("scripta_user_type");
}

// ─── AUTH / LOGIN ───────────────────────────────────────────────────────────────

export async function login({ email, senha }) {
  return apiRequest("/auth/login", { method: "POST", body: { email, senha } });
}

// ─── REGISTRO ──────────────────────────────────────────────────────────────────

export async function registerAluno(data) {
  return apiRequest("/alunos/", { method: "POST", body: data });
}

export async function registerProfessor(data) {
  return apiRequest("/professores/", { method: "POST", body: data });
}

export async function registerEmpresa(data) {
  return apiRequest("/empresas/", { method: "POST", body: data });
}

// ─── ALUNO (Movido para features/aluno/api/alunoApi.js) ────────────────────────


// ─── PROFESSOR (Movido para features/professor/api/professorApi.js) ─────────────

// ─── EMPRESA (Movido para features/empresa/api/empresaApi.js) ───────────────


// ─── COORDENADOR (Movido para features/coordenacao/api/coordenacaoApi.js) ───────

// ─── PROJETOS (Movido para lib/projetosApi.js) ─────────────────────────────────

// ─── PORTFÓLIO (Movido para lib/portfolioApi.js) ──────────────────────────────

// ─── CONTATOS EMPRESA → ALUNO (Movido para lib/contatosApi.js) ────────────────
