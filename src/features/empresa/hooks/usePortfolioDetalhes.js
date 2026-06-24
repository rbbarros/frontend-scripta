import { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";

export function usePortfolioDetalhes(id) {
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    async function fetchDetalhes() {
      try {
        const data = await apiRequest(`/alunos/${id}`);
        setAluno(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do aluno:", error);
        setAluno(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDetalhes();
  }, [id]);

  return { aluno, loading };
}
