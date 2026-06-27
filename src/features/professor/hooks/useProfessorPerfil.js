import { useCallback, useEffect, useState } from "react";

import { getAvaliacoes } from "../../../lib/avaliacoesApi";
import { getProjetos } from "../../../lib/projetosApi";

import { getProfessorPerfil, updateProfessorPerfil } from "../api/professorApi";

export function useProfessorPerfil() {
  const [perfil, setPerfil] = useState(null);

  const [metricas, setMetricas] = useState({
    avaliacoes: 0,
    projetos: 0,
  });

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  const fetchPerfil = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const [perfilData, projetosData, avaliacoesData] = await Promise.all([
        getProfessorPerfil(),
        getProjetos(),
        getAvaliacoes(),
      ]);

      setPerfil(perfilData);

      setMetricas({
        projetos: Array.isArray(projetosData) ? projetosData.length : 0,

        avaliacoes: Array.isArray(avaliacoesData) ? avaliacoesData.length : 0,
      });
    } catch (error) {
      setPerfil(null);

      setMetricas({
        avaliacoes: 0,
        projetos: 0,
      });

      setErro(error.message || "Não foi possível carregar o perfil.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerfil();
  }, [fetchPerfil]);

  async function updatePerfil(formData) {
    await updateProfessorPerfil(formData);

    setPerfil((perfilAtual) => ({
      ...perfilAtual,
      ...formData,
    }));
  }

  return {
    perfil,
    metricas,
    loading,
    erro,
    updatePerfil,
    recarregar: fetchPerfil,
  };
}
