import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../../../lib/api";

import { getAlunos } from "../../aluno/api/alunoApi";
import { getProfessores } from "../../professor/api/professorApi";

export function useCoordenacaoProjetos() {
  const [projetos, setProjetos] = useState([]);

  const [alunos, setAlunos] = useState([]);

  const [professores, setProfessores] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchDados = useCallback(async () => {
    setLoading(true);
    setError("");

    const resultados = await Promise.allSettled([
      apiRequest("/relatorios/projetos"),
      getAlunos(),
      getProfessores(),
    ]);

    const [projetosResultado, alunosResultado, professoresResultado] =
      resultados;

    if (projetosResultado.status === "fulfilled") {
      const dados = projetosResultado.value;

      setProjetos(Array.isArray(dados?.projetos) ? dados.projetos : []);
    } else {
      setProjetos([]);
    }

    if (
      alunosResultado.status === "fulfilled" &&
      Array.isArray(alunosResultado.value)
    ) {
      setAlunos(alunosResultado.value);
    } else {
      setAlunos([]);
    }

    if (
      professoresResultado.status === "fulfilled" &&
      Array.isArray(professoresResultado.value)
    ) {
      setProfessores(professoresResultado.value);
    } else {
      setProfessores([]);
    }

    const houveFalha = resultados.some(
      (resultado) => resultado.status === "rejected",
    );

    if (houveFalha) {
      setError(
        "Algumas informações da área de projetos não puderam ser carregadas.",
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  return {
    projetos,
    alunos,
    professores,
    loading,
    error,
    refetch: fetchDados,
  };
}
