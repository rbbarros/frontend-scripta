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

export async function loginAluno({ email, senha }) {
  return apiRequest("/alunos/login", { method: "POST", body: { email, senha } });
}

export async function loginProfessor({ email, senha }) {
  return apiRequest("/professores/login", { method: "POST", body: { email, senha } });
}

export async function loginEmpresa({ email_contato, senha }) {
  return apiRequest("/empresas/login", { method: "POST", body: { email_contato, senha } });
}

export async function loginCoordenador({ email, senha }) {
  return apiRequest("/coordenadores/login", { method: "POST", body: { email, senha } });
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

// ─── ALUNO ─────────────────────────────────────────────────────────────────────

export async function getAlunoPerfil() {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/alunos/${userId}`);
}

export async function updateAlunoPerfil(data) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/alunos/${userId}`, { method: "PUT", body: data });
}

export async function getAlunos() {
  return apiRequest("/alunos/");
}

// ─── PROFESSOR ─────────────────────────────────────────────────────────────────

export async function getProfessorPerfil() {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/professores/${userId}`);
}

export async function updateProfessorPerfil(data) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/professores/${userId}`, { method: "PUT", body: data });
}

export async function getProfessores() {
  return apiRequest("/professores/");
}

// ─── EMPRESA ───────────────────────────────────────────────────────────────────

export async function getEmpresaPerfil() {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/empresas/${userId}`);
}

export async function updateEmpresaPerfil(data) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/empresas/${userId}`, { method: "PUT", body: data });
}

export async function getEmpresas() {
  return apiRequest("/empresas/");
}

// ─── COORDENADOR ───────────────────────────────────────────────────────────────

export async function getCoordenadorPerfil() {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/coordenadores/${userId}`);
}

export async function updateCoordenadorPerfil(data) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuário não autenticado.");
  return apiRequest(`/coordenadores/${userId}`, { method: "PUT", body: data });
}

export async function getCoordenadores() {
  return apiRequest("/coordenadores/");
}

// ─── PROJETOS ──────────────────────────────────────────────────────────────────

export async function getProjetos() {
  return apiRequest("/projetos/");
}

export async function getProjetoPorId(id) {
  return apiRequest(`/projetos/${id}`);
}

export async function createProjeto(data) {
  return apiRequest("/projetos/", { method: "POST", body: data });
}

export async function updateProjeto(id, data) {
  return apiRequest(`/projetos/${id}`, { method: "PUT", body: data });
}

export async function updateProjetoStatus(id, status) {
  return apiRequest(`/projetos/${id}/status`, { method: "PATCH", body: { status } });
}

export async function deletarProjeto(id) {
  return apiRequest(`/projetos/${id}`, { method: "DELETE" });
}

// ─── INTEGRANTES DE PROJETO ────────────────────────────────────────────────────

export async function getIntegrantesDoProjeto(projetoId) {
  return apiRequest(`/projetos/${projetoId}/integrantes/`);
}

export async function addIntegranteAoProjeto(projetoId, data) {
  // data: { aluno_id: int }
  return apiRequest(`/projetos/${projetoId}/integrantes/`, { method: "POST", body: data });
}

// ─── PORTFÓLIO ─────────────────────────────────────────────────────────────────

export async function getPortfolioList() {
  return apiRequest("/portfolios/");
}

export async function getPortfolioPorId(id) {
  return apiRequest(`/portfolios/${id}`);
}

export async function createPortfolio(data) {
  // data: { aluno_id, projeto_id, visibilidade }
  return apiRequest("/portfolios/", { method: "POST", body: data });
}

export async function updatePortfolio(id, data) {
  // data: { visibilidade }
  return apiRequest(`/portfolios/${id}`, { method: "PUT", body: data });
}

export async function deletarPortfolio(id) {
  return apiRequest(`/portfolios/${id}`, { method: "DELETE" });
}

// ─── CONTATOS EMPRESA → ALUNO ──────────────────────────────────────────────────

export async function getContatosByAluno(alunoId) {
  return apiRequest(`/contatos/aluno/${alunoId}`);
}

export async function createContato(data) {
  // data: { aluno_id, empresa_id, mensagem }
  return apiRequest("/contatos/", { method: "POST", body: data });
}

export async function getContatoPorId(id) {
  return apiRequest(`/contatos/${id}`);
}
