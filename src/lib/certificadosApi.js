import { apiRequest } from "./api";

export async function getMeusCertificados() {
  return apiRequest("/certificados/meus");
}

export async function getTodosCertificados() {
  return apiRequest("/certificados/");
}

export async function getCertificadoPorId(id) {
  return apiRequest(`/certificados/${id}`);
}

export async function getCertificadosPorAluno(alunoId) {
  return apiRequest(`/certificados/aluno/${alunoId}`);
}

export async function getCertificadosPorProjeto(projetoId) {
  return apiRequest(`/certificados/projeto/${projetoId}`);
}

export async function emitirCertificados(projetoId) {
  return apiRequest("/certificados/emitir", {
    method: "POST",
    body: {
      projeto_id: Number(projetoId),
    },
  });
}
