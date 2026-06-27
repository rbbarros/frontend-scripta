import { useCallback, useEffect, useState } from "react";

import { getAvaliacoes } from "../../../lib/avaliacoesApi";
import { getProjetos } from "../../../lib/projetosApi";

import { getProfessorPerfil } from "../api/professorApi";

export function useProfessorDashboard() {
  const [perfil, setPerfil] = useState(null);

  const [projetos, setProjetos] = useState([]);

  const [avaliacoes, setAvaliacoes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  const fetchDados = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const [perfilData, projetosData, avaliacoesData] = await Promise.all([
        getProfessorPerfil(),
        getProjetos(),
        getAvaliacoes(),
      ]);

      setPerfil(perfilData);

      setProjetos(Array.isArray(projetosData) ? projetosData : []);

      setAvaliacoes(Array.isArray(avaliacoesData) ? avaliacoesData : []);
    } catch (error) {
      setPerfil(null);
      setProjetos([]);
      setAvaliacoes([]);

      setErro(error.message || "Não foi possível carregar o dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  return {
    perfil,
    projetos,
    avaliacoes,
    loading,
    erro,
    recarregar: fetchDados,
  };
}
