import { useCallback, useEffect, useState } from "react";

import { getRanking } from "../../../lib/rankingApi";

function montarFiltros(filtros) {
  return {
    curso: filtros.curso || undefined,
    turma: filtros.turma || undefined,
    semestre: filtros.semestre || undefined,
  };
}

export function useAlunoRanking() {
  const [ranking, setRanking] = useState([]);

  const [rankingCompleto, setRankingCompleto] = useState([]);

  const [totalProjetos, setTotalProjetos] = useState(0);

  const [loading, setLoading] = useState(true);

  const [atualizando, setAtualizando] = useState(false);

  const [erro, setErro] = useState("");

  const carregarRanking = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const resposta = await getRanking();

      const projetos = Array.isArray(resposta?.ranking) ? resposta.ranking : [];

      setRanking(projetos);
      setRankingCompleto(projetos);

      setTotalProjetos(Number(resposta?.total_projetos) || projetos.length);
    } catch (error) {
      setRanking([]);
      setRankingCompleto([]);
      setTotalProjetos(0);

      setErro(error.message || "Não foi possível carregar o ranking.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarRanking();
  }, [carregarRanking]);

  const aplicarFiltros = useCallback(async (filtros) => {
    setAtualizando(true);
    setErro("");

    try {
      const resposta = await getRanking(montarFiltros(filtros));

      const projetos = Array.isArray(resposta?.ranking) ? resposta.ranking : [];

      setRanking(projetos);

      setTotalProjetos(Number(resposta?.total_projetos) || projetos.length);
    } catch (error) {
      setRanking([]);
      setTotalProjetos(0);

      setErro(error.message || "Não foi possível filtrar o ranking.");

      throw error;
    } finally {
      setAtualizando(false);
    }
  }, []);

  return {
    ranking,
    rankingCompleto,
    totalProjetos,
    loading,
    atualizando,
    erro,
    aplicarFiltros,
    recarregar: carregarRanking,
  };
}
