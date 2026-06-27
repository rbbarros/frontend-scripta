import { useCallback, useEffect, useState } from "react";

import { getAvaliacoes } from "../../../lib/avaliacoesApi";
import { getProjetos } from "../../../lib/projetosApi";

export function useProfessorProjetos() {
  const [projetos, setProjetos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  const fetchProjetos = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const [projetosData, avaliacoesData] = await Promise.all([
        getProjetos(),
        getAvaliacoes(),
      ]);

      const listaProjetos = Array.isArray(projetosData) ? projetosData : [];

      const listaAvaliacoes = Array.isArray(avaliacoesData)
        ? avaliacoesData
        : [];

      const avaliacoesPorProjeto = new Map(
        listaAvaliacoes.map((avaliacao) => [avaliacao.projeto_id, avaliacao]),
      );

      const projetosComAvaliacao = listaProjetos.map((projeto) => {
        const avaliacao = avaliacoesPorProjeto.get(projeto.id);

        let statusAvaliacao = "pendente";

        if (avaliacao) {
          statusAvaliacao = "avaliado";
        } else if (
          projeto.status === "aprovado" ||
          projeto.status === "reprovado"
        ) {
          statusAvaliacao = "encerrado";
        }

        return {
          ...projeto,
          avaliacao: avaliacao || null,
          avaliacao_id: avaliacao?.id || null,
          status_avaliacao: statusAvaliacao,
        };
      });

      setProjetos(projetosComAvaliacao);
    } catch (error) {
      setProjetos([]);

      setErro(error.message || "Não foi possível carregar os projetos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjetos();
  }, [fetchProjetos]);

  return {
    projetos,
    loading,
    erro,
    recarregar: fetchProjetos,
  };
}
