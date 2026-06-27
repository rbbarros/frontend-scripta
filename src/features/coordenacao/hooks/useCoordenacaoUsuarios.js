import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../../../lib/api";

const ENDPOINTS = {
  aluno: "/alunos",
  professor: "/professores",
  empresa: "/empresas",
};

function normalizarUsuarios(dados, tipo) {
  if (!Array.isArray(dados)) {
    return [];
  }

  return dados.map((usuario) => ({
    ...usuario,
    tipo,
    perfil:
      tipo === "aluno"
        ? "Aluno"
        : tipo === "professor"
          ? "Professor"
          : "Empresa",
    nomeExibicao: tipo === "empresa" ? usuario.nome_empresa : usuario.nome,
    emailExibicao: tipo === "empresa" ? usuario.email_contato : usuario.email,
    detalheExibicao:
      tipo === "aluno"
        ? usuario.curso
        : tipo === "professor"
          ? usuario.area_atuacao
          : usuario.setor,
  }));
}

export function useCoordenacaoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  const carregarUsuarios = useCallback(async () => {
    setLoading(true);
    setErro("");

    const resultados = await Promise.allSettled([
      apiRequest("/alunos/"),
      apiRequest("/professores/"),
      apiRequest("/empresas/"),
    ]);

    const [alunosResultado, professoresResultado, empresasResultado] =
      resultados;

    const alunos =
      alunosResultado.status === "fulfilled"
        ? normalizarUsuarios(alunosResultado.value, "aluno")
        : [];

    const professores =
      professoresResultado.status === "fulfilled"
        ? normalizarUsuarios(professoresResultado.value, "professor")
        : [];

    const empresas =
      empresasResultado.status === "fulfilled"
        ? normalizarUsuarios(empresasResultado.value, "empresa")
        : [];

    setUsuarios([...alunos, ...professores, ...empresas]);

    const houveFalha = resultados.some(
      (resultado) => resultado.status === "rejected",
    );

    if (houveFalha) {
      setErro("Alguns usuários não puderam ser carregados.");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const atualizarUsuario = useCallback(
    async (usuario, dados) => {
      const endpoint = ENDPOINTS[usuario.tipo];

      if (!endpoint) {
        throw new Error("Perfil de usuário inválido.");
      }

      await apiRequest(`${endpoint}/${usuario.id}`, {
        method: "PUT",
        body: dados,
      });

      await carregarUsuarios();
    },
    [carregarUsuarios],
  );

  const excluirUsuario = useCallback(
    async (usuario) => {
      const endpoint = ENDPOINTS[usuario.tipo];

      if (!endpoint) {
        throw new Error("Perfil de usuário inválido.");
      }

      await apiRequest(`${endpoint}/${usuario.id}`, {
        method: "DELETE",
      });

      await carregarUsuarios();
    },
    [carregarUsuarios],
  );

  return {
    usuarios,
    loading,
    erro,
    atualizarUsuario,
    excluirUsuario,
    refetch: carregarUsuarios,
  };
}
