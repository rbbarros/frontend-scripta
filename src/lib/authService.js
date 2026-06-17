import { apiRequest } from "./api";
import { getCurrentUserId } from "./session";

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

function requireUserId() {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Usuário não autenticado.");
  }
  return userId;
}

export async function getAlunoPerfil(id = requireUserId()) {
  return apiRequest(`/alunos/${id}`);
}

export async function updateAlunoPerfil(data, id = requireUserId()) {
  return apiRequest(`/alunos/${id}`, { method: "PUT", body: data });
}

export async function deleteAluno(id) {
  return apiRequest(`/alunos/${id}`, { method: "DELETE" });
}

export async function getProfessorPerfil(id = requireUserId()) {
  return apiRequest(`/professores/${id}`);
}

export async function updateProfessorPerfil(data, id = requireUserId()) {
  return apiRequest(`/professores/${id}`, { method: "PUT", body: data });
}

export async function deleteProfessor(id) {
  return apiRequest(`/professores/${id}`, { method: "DELETE" });
}

export async function getEmpresaPerfil(id = requireUserId()) {
  return apiRequest(`/empresas/${id}`);
}

export async function updateEmpresaPerfil(data, id = requireUserId()) {
  return apiRequest(`/empresas/${id}`, { method: "PUT", body: data });
}

export async function deleteEmpresa(id) {
  return apiRequest(`/empresas/${id}`, { method: "DELETE" });
}

export async function getCoordenadorPerfil(id = requireUserId()) {
  return apiRequest(`/coordenadores/${id}`);
}

export async function updateCoordenadorPerfil(data, id = requireUserId()) {
  return apiRequest(`/coordenadores/${id}`, { method: "PUT", body: data });
}
