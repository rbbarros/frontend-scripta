import { useCallback, useEffect, useState } from "react";

import { getAvaliacaoPorId, getAvaliacoes } from "../../../lib/avaliacoesApi";

import { getProfessorPerfil } from "../api/professorApi";

export function useProfessorAvaliacoes() {
  const [perfil, setPerfil] = useState(null);

  const [avaliacoes, setAvaliacoes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  const carregarAvaliacoes = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const [perfilData, resumosData] = await Promise.all([
        getProfessorPerfil(),
        getAvaliacoes(),
      ]);

      const resumos = Array.isArray(resumosData) ? resumosData : [];

      const resultados = await Promise.allSettled(
        resumos.map((avaliacao) => getAvaliacaoPorId(avaliacao.id)),
      );

      const avaliacoesCompletas = resultados.map((resultado, index) => {
        if (resultado.status === "fulfilled") {
          return resultado.value;
        }

        return resumos[index];
      });

      setPerfil(perfilData);
      setAvaliacoes(avaliacoesCompletas);
    } catch (error) {
      setPerfil(null);
      setAvaliacoes([]);

      setErro(
        error.message || "Não foi possível carregar o histórico de avaliações.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarAvaliacoes();
  }, [carregarAvaliacoes]);

  return {
    perfil,
    avaliacoes,
    loading,
    erro,
    recarregar: carregarAvaliacoes,
  };
}
